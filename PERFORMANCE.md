
## 🔴 Critical (Biggest Impact)

### 1. Switch Cache Driver (Required)
Your `.env` uses `CACHE_STORE=database` - this is slow! Each cache read hits the database.

```bash
# Option A: File-based cache (simplest, recommended if no Redis)
CACHE_STORE=file

# Option B: Redis (best performance)
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### 2. Switch Session Driver
```bash
# Option A: File (simplest)
SESSION_DRIVER=file

# Option B: Redis (best)
SESSION_DRIVER=redis
```

### 3. Run Database Migration
The performance indexes migration is ready:
```bash
php artisan migrate
```

### 4. Setup Scheduler (Currency Sync)
Add to your server's crontab:
```bash
* * * * * cd /var/www/Rent-a-car-vite && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🟡 Production Optimizations

### Clear and Cache Config
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Disable Debug
In `.env`:
```bash
APP_DEBUG=false
APP_ENV=production
```

### OPcache (PHP)
Add to `php.ini`:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.validate_timestamps=0
```

---

## 🟢 Nginx Gzip Compression

Add to `/etc/nginx/nginx.conf` in http block:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/javascript
    text/xml
    application/json
    application/javascript
    application/xml
    application/xml+rss
    image/svg+xml;
```

With gzip, your 37KB JSON response becomes ~5KB over the wire.

---

## 🟢 Static Asset Caching

Nginx location block:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Current Response Size

| Component | Size | Gzipped |
|-----------|------|---------|
| Cars (14) | 9 KB | ~1.5 KB |
| Translations | 26 KB | ~4 KB |
| Locations | 0.2 KB | ~0.1 KB |
| **Total** | **~37 KB** | **~6 KB** |

---

## Performance Checklist

- [ ] CACHE_STORE=file or redis
- [ ] SESSION_DRIVER=file or redis  
- [ ] `php artisan migrate` for indexes
- [ ] Scheduler cron configured
- [ ] `php artisan config:cache`
- [ ] `php artisan route:cache`
- [ ] APP_DEBUG=false in production
- [ ] Nginx gzip enabled
- [ ] OPcache enabled
