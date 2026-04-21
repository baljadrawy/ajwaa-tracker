#!/bin/bash
# ============================================================
#  Ajwaa Tracker — سكريبت التثبيت على Raspberry Pi
#  Ubuntu Server / Raspberry Pi OS (ARM64)
# ============================================================

set -e  # إيقاف عند أي خطأ

# ألوان للمخرجات
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # بدون لون

print_step() { echo -e "\n${BLUE}══════════════════════════════${NC}"; echo -e "${GREEN}✓ $1${NC}"; }
print_warn() { echo -e "${YELLOW}⚠  $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════╗"
echo "║     متتبع ملاحظات أجواء — التثبيت       ║"
echo "║         Ajwaa Tracker Installer          ║"
echo "╚══════════════════════════════════════════╝"
echo -e "${NC}"

# ──────────────────────────────
# 1. التحقق من Docker و Docker Compose
# ──────────────────────────────
print_step "التحقق من Docker..."

if ! command -v docker &> /dev/null; then
    print_error "Docker غير مثبّت! ثبّته أولاً:"
    echo "  curl -fsSL https://get.docker.com | sudo sh"
    echo "  sudo usermod -aG docker \$USER"
    echo "  ثم أعد تشغيل الجلسة وشغّل السكريبت مجدداً"
    exit 1
fi

DOCKER_VERSION=$(docker --version | awk '{print $3}' | tr -d ',')
echo "  Docker: $DOCKER_VERSION ✓"

if ! docker compose version &> /dev/null; then
    print_error "Docker Compose (v2) غير متوفر! ثبّته:"
    echo "  sudo apt install docker-compose-plugin -y"
    exit 1
fi

COMPOSE_VERSION=$(docker compose version --short)
echo "  Docker Compose: $COMPOSE_VERSION ✓"

# ──────────────────────────────
# 2. التحقق من الصلاحيات
# ──────────────────────────────
print_step "التحقق من صلاحيات Docker..."

if ! docker ps &> /dev/null; then
    print_warn "المستخدم الحالي لا يملك صلاحية Docker. جارٍ الإضافة..."
    sudo usermod -aG docker $USER
    print_warn "يجب تسجيل الخروج والدخول مجدداً ثم إعادة تشغيل السكريبت"
    print_warn "أو شغّل: newgrp docker"
    exit 1
fi
echo "  صلاحيات Docker: سليمة ✓"

# ──────────────────────────────
# 3. إنشاء المجلدات المطلوبة
# ──────────────────────────────
print_step "إنشاء المجلدات المطلوبة..."

mkdir -p data uploads
chmod 777 uploads
echo "  data/ و uploads/ ✓"

# ──────────────────────────────
# 4. التحقق من المنافذ المطلوبة
# ──────────────────────────────
print_step "التحقق من المنافذ (80, 4000, 5432)..."

check_port() {
    if ss -tlnp | grep -q ":$1 "; then
        print_warn "المنفذ $1 مستخدم من عملية أخرى!"
        ss -tlnp | grep ":$1 "
        return 1
    else
        echo "  المنفذ $1: متاح ✓"
        return 0
    fi
}

PORT_OK=true
check_port 80  || PORT_OK=false
check_port 4000 || PORT_OK=false
check_port 5432 || PORT_OK=false

if [ "$PORT_OK" = false ]; then
    print_warn "بعض المنافذ مشغولة. قد تحتاج لإيقاف الخدمات المتعارضة."
    read -p "هل تريد المتابعة رغم ذلك؟ (y/n): " -n 1 -r
    echo
    [[ ! $REPLY =~ ^[Yy]$ ]] && exit 1
fi

# ──────────────────────────────
# 5. بناء الحاويات
# ──────────────────────────────
print_step "بناء الحاويات (قد يأخذ 5-15 دقيقة على الرازبري باي)..."
print_warn "الرازبري باي أبطأ من الكمبيوتر العادي — الصبر مطلوب!"

docker compose build --no-cache

# ──────────────────────────────
# 6. تشغيل الخدمات
# ──────────────────────────────
print_step "تشغيل الخدمات..."
docker compose up -d

# ──────────────────────────────
# 7. انتظار جاهزية الخدمات
# ──────────────────────────────
print_step "انتظار جاهزية الخدمات..."

echo -n "  PostgreSQL"
for i in {1..30}; do
    if docker compose exec -T postgres pg_isready -U ajwaa -d ajwaa_db &>/dev/null; then
        echo " ✓"
        break
    fi
    echo -n "."
    sleep 2
    if [ $i -eq 30 ]; then
        echo ""
        print_error "PostgreSQL لم يبدأ خلال 60 ثانية!"
        docker compose logs postgres
        exit 1
    fi
done

echo -n "  Backend API"
for i in {1..20}; do
    if curl -sf http://localhost:4000/api/auth/me &>/dev/null || \
       curl -sf http://localhost:4000/api/auth/me 2>&1 | grep -q "401\|Unauthorized"; then
        echo " ✓"
        break
    fi
    # أيضاً نقبل 401 كمؤشر أن الـ API يعمل
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/api/auth/me 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "200" ]; then
        echo " ✓ (HTTP $HTTP_CODE)"
        break
    fi
    echo -n "."
    sleep 3
    if [ $i -eq 20 ]; then
        echo ""
        print_warn "Backend قد لا يزال يبدأ. تحقق من: docker compose logs backend"
    fi
done

# ──────────────────────────────
# 8. الحصول على عنوان IP
# ──────────────────────────────
print_step "معلومات الوصول..."

RPI_IP=$(hostname -I | awk '{print $1}')

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ✅ التثبيت اكتمل بنجاح!             ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  🌐 الواجهة:   http://${RPI_IP}             ${NC}"
echo -e "${GREEN}║  🔧 Backend:   http://${RPI_IP}:4000        ${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  👤 اسم المستخدم:  admin                    ║${NC}"
echo -e "${GREEN}║  🔑 كلمة المرور:   admin123                 ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  📌 افتح هذا الرابط من أي جهاز على الشبكة  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "أوامر مفيدة:"
echo -e "  ${YELLOW}docker compose logs -f${NC}          — عرض اللوقات"
echo -e "  ${YELLOW}docker compose ps${NC}               — حالة الحاويات"
echo -e "  ${YELLOW}docker compose down${NC}             — إيقاف"
echo -e "  ${YELLOW}docker compose up -d${NC}            — تشغيل"
echo ""
