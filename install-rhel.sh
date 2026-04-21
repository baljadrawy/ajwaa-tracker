#!/bin/bash
# ============================================================
#  Ajwaa Tracker — سكريبت التثبيت على Red Hat Enterprise Linux
#  RHEL 8/9 | Rocky Linux 8/9 | AlmaLinux 8/9
#  يجب تشغيله بـ sudo أو root
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_step()  { echo -e "\n${BLUE}══════════════════════════════════════════${NC}"; echo -e "${GREEN}▶  $1${NC}"; }
print_warn()  { echo -e "${YELLOW}⚠  $1${NC}"; }
print_error() { echo -e "${RED}✗  $1${NC}"; exit 1; }
print_ok()    { echo -e "${GREEN}   ✓ $1${NC}"; }

# ── Banner ──────────────────────────────────────────────────
echo -e "${BLUE}"
cat << 'BANNER'
╔══════════════════════════════════════════════════════╗
║        متابعة ملاحظات منصة أجواء — التثبيت         ║
║      Ajwaa Tracker — RHEL/Rocky/AlmaLinux            ║
╚══════════════════════════════════════════════════════╝
BANNER
echo -e "${NC}"

# ── التحقق من صلاحيات root ──────────────────────────────────
if [ "$EUID" -ne 0 ]; then
    print_error "شغّل السكريبت بـ sudo:\n  sudo bash install-rhel.sh"
fi

# ── التحقق من توزيعة RHEL ───────────────────────────────────
print_step "1. التحقق من بيئة التشغيل..."

if [ -f /etc/redhat-release ]; then
    DISTRO=$(cat /etc/redhat-release)
    print_ok "التوزيعة: $DISTRO"
else
    print_warn "لم يتم التعرف على التوزيعة كـ RHEL. قد يعمل السكريبت مع توزيعات أخرى."
fi

ARCH=$(uname -m)
print_ok "المعمارية: $ARCH"

# ── تحديث النظام ────────────────────────────────────────────
print_step "2. تحديث حزم النظام..."
dnf update -y -q
print_ok "تم تحديث النظام"

# ── تثبيت الأدوات الأساسية ───────────────────────────────────
print_step "3. تثبيت الأدوات الأساسية..."
dnf install -y -q curl wget git unzip net-tools firewalld
print_ok "curl, wget, git, net-tools, firewalld"

# ── تثبيت Docker ────────────────────────────────────────────
print_step "4. تثبيت Docker..."

if command -v docker &>/dev/null; then
    DOCKER_VER=$(docker --version | awk '{print $3}' | tr -d ',')
    print_ok "Docker مثبّت مسبقاً: $DOCKER_VER"
else
    echo "  إضافة Docker repository..."
    dnf config-manager --add-repo https://download.docker.com/linux/rhel/docker-ce.repo 2>/dev/null || \
    dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

    dnf install -y -q docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    print_ok "Docker CE مثبّت"
fi

# تشغيل Docker
systemctl enable docker --now
print_ok "Docker service: running"

# إضافة المستخدم الحالي لمجموعة docker (إن لم يكن root)
if [ -n "$SUDO_USER" ]; then
    usermod -aG docker "$SUDO_USER"
    print_ok "المستخدم $SUDO_USER أُضيف لمجموعة docker"
fi

# ── التحقق من Docker Compose ────────────────────────────────
print_step "5. التحقق من Docker Compose..."

if docker compose version &>/dev/null; then
    COMPOSE_VER=$(docker compose version --short)
    print_ok "Docker Compose v2: $COMPOSE_VER"
else
    print_error "Docker Compose plugin غير متوفر! ثبّته:\n  dnf install -y docker-compose-plugin"
fi

# ── إعداد Firewall ─────────────────────────────────────────
print_step "6. إعداد جدار الحماية (Firewall)..."

if systemctl is-active firewalld &>/dev/null; then
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=4000/tcp
    firewall-cmd --reload
    print_ok "المنافذ 80, 443, 4000 مفتوحة في firewalld"
else
    systemctl enable firewalld --now
    firewall-cmd --permanent --add-port=80/tcp
    firewall-cmd --permanent --add-port=443/tcp
    firewall-cmd --permanent --add-port=4000/tcp
    firewall-cmd --reload
    print_ok "firewalld شُغّل والمنافذ مفتوحة"
fi

# SELinux — السماح لـ Docker بالوصول للشبكة
if command -v getenforce &>/dev/null; then
    SELINUX=$(getenforce)
    if [ "$SELINUX" = "Enforcing" ]; then
        setsebool -P container_manage_cgroup on 2>/dev/null || true
        print_ok "SELinux: $SELINUX — تم ضبط container permissions"
    else
        print_ok "SELinux: $SELINUX"
    fi
fi

# ── سحب المشروع من GitHub ───────────────────────────────────
print_step "7. سحب المشروع..."

INSTALL_DIR="/opt/ajwaa-tracker"

if [ -d "$INSTALL_DIR/.git" ]; then
    echo "  المشروع موجود — جارٍ التحديث..."
    cd "$INSTALL_DIR"
    git pull origin main
    print_ok "تم تحديث المشروع"
else
    echo "  استنساخ المشروع من GitHub..."
    git clone https://github.com/baljadrawy/ajwaa-tracker.git "$INSTALL_DIR"
    cd "$INSTALL_DIR"
    print_ok "تم استنساخ المشروع في $INSTALL_DIR"
fi

# ── إعداد ملف البيئة ────────────────────────────────────────
print_step "8. إعداد متغيرات البيئة..."

cd "$INSTALL_DIR"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        print_warn "تم نسخ .env.example → .env"
        print_warn "يُنصح بتغيير JWT_SECRET و DB_PASSWORD قبل الاستخدام الفعلي!"
    else
        # إنشاء .env افتراضي
        cat > .env << 'ENVEOF'
# قاعدة البيانات
DB_NAME=ajwaa_db
DB_USER=ajwaa
DB_PASSWORD=ajwaa_pass_prod_2026

# JWT — غيّر هذه القيمة لشيء عشوائي طويل
JWT_SECRET=ajwaa-jwt-change-this-secret-key-2026

# بيئة التشغيل
NODE_ENV=production
PORT=4000
ENVEOF
        print_ok "تم إنشاء ملف .env افتراضي"
    fi
else
    print_ok ".env موجود مسبقاً"
fi

# ── إنشاء المجلدات المطلوبة ──────────────────────────────────
print_step "9. إنشاء المجلدات..."

mkdir -p data uploads
chmod 755 data
chmod 777 uploads

# ضبط ملكية المجلدات للعمل مع Docker
chown -R 999:999 data 2>/dev/null || true

print_ok "data/ و uploads/ جاهزة"

# ── التحقق من المنافذ ───────────────────────────────────────
print_step "10. التحقق من المنافذ..."

check_port() {
    if ss -tlnp 2>/dev/null | grep -q ":$1 "; then
        print_warn "المنفذ $1 مستخدم — قد يكون تعارض"
        return 1
    else
        print_ok "المنفذ $1: متاح"
        return 0
    fi
}

check_port 80
check_port 4000

# ── بناء الحاويات وتشغيلها ──────────────────────────────────
print_step "11. بناء الحاويات (قد يستغرق 10-20 دقيقة)..."

# استخدم prod compose إن وجد، وإلا الافتراضي
if [ -f docker-compose.prod.yml ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    print_ok "استخدام docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
    print_warn "استخدام docker-compose.yml (الافتراضي)"
fi

docker compose -f "$COMPOSE_FILE" build --no-cache
print_ok "بناء الحاويات: اكتمل"

print_step "12. تشغيل الخدمات..."
docker compose -f "$COMPOSE_FILE" up -d
print_ok "الحاويات تعمل"

# ── انتظار جاهزية الخدمات ──────────────────────────────────
print_step "13. انتظار جاهزية الخدمات..."

echo -n "  PostgreSQL"
for i in $(seq 1 30); do
    if docker compose -f "$COMPOSE_FILE" exec -T postgres \
       pg_isready -U ajwaa -d ajwaa_db &>/dev/null 2>&1; then
        echo " ✓"
        break
    fi
    echo -n "."
    sleep 2
    [ $i -eq 30 ] && { echo ""; print_error "PostgreSQL لم يبدأ. شغّل: docker compose logs postgres"; }
done

echo -n "  Backend API"
for i in $(seq 1 20); do
    HTTP=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4000/health 2>/dev/null || echo "000")
    if [ "$HTTP" = "200" ]; then
        echo " ✓ (HTTP 200)"
        break
    fi
    echo -n "."
    sleep 3
    [ $i -eq 20 ] && { echo ""; print_warn "Backend قد يحتاج وقتاً أكثر. راجع: docker compose logs backend"; }
done

# ── تشغيل Migration إن وجد ─────────────────────────────────
print_step "14. التحقق من Migrations..."

for migration_file in db/migrate_*.sql; do
    [ -f "$migration_file" ] || continue
    echo "  تشغيل: $migration_file"
    docker compose -f "$COMPOSE_FILE" exec -T postgres \
        psql -U ajwaa -d ajwaa_db < "$migration_file" 2>/dev/null || \
        print_warn "قد يكون $migration_file طُبِّق مسبقاً (طبيعي)"
done
print_ok "Migrations: اكتمل"

# ── إعداد systemd service (إعادة تشغيل تلقائي) ──────────────
print_step "15. إعداد خدمة Systemd..."

COMPOSE_ABS_FILE="$INSTALL_DIR/$COMPOSE_FILE"

cat > /etc/systemd/system/ajwaa-tracker.service << SYSTEMD
[Unit]
Description=Ajwaa Tracker — متابعة ملاحظات منصة أجواء
After=docker.service network-online.target
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/docker compose -f $COMPOSE_ABS_FILE up -d
ExecStop=/usr/bin/docker compose -f $COMPOSE_ABS_FILE down
TimeoutStartSec=300
Restart=on-failure

[Install]
WantedBy=multi-user.target
SYSTEMD

systemctl daemon-reload
systemctl enable ajwaa-tracker
print_ok "systemd service: ajwaa-tracker (تشغيل تلقائي عند إقلاع النظام)"

# ── عرض معلومات الوصول ──────────────────────────────────────
SERVER_IP=$(hostname -I | awk '{print $1}')
HOSTNAME_VAL=$(hostname)

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║           ✅ التثبيت اكتمل بنجاح!                  ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
printf "${GREEN}║  🌐 الواجهة:   %-38s║${NC}\n" "http://$SERVER_IP"
printf "${GREEN}║  🔧 Backend:   %-38s║${NC}\n" "http://$SERVER_IP:4000/health"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  👤 المستخدم الافتراضي:  admin                      ║${NC}"
echo -e "${GREEN}║  🔑 كلمة المرور:         admin123                   ║${NC}"
echo -e "${GREEN}║  ⚠️  غيّر كلمة المرور بعد أول دخول!                 ║${NC}"
echo -e "${GREEN}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${GREEN}║  📁 مجلد التثبيت:  $INSTALL_DIR             ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}أوامر مفيدة:${NC}"
echo -e "  ${YELLOW}cd $INSTALL_DIR${NC}"
echo -e "  ${YELLOW}docker compose -f $COMPOSE_FILE logs -f${NC}     — عرض اللوقات"
echo -e "  ${YELLOW}docker compose -f $COMPOSE_FILE ps${NC}          — حالة الحاويات"
echo -e "  ${YELLOW}docker compose -f $COMPOSE_FILE down${NC}        — إيقاف"
echo -e "  ${YELLOW}systemctl status ajwaa-tracker${NC}              — حالة الخدمة"
echo -e "  ${YELLOW}git pull origin main && docker compose -f $COMPOSE_FILE build --no-cache && docker compose -f $COMPOSE_FILE up -d${NC}"
echo -e "  (أمر التحديث الكامل)"
echo ""
