# Maritime Solutions Keycloak Theme

A custom Keycloak login theme matching the TransTRACK Maritime Solutions design.

## Installation

### Option 1: Deploy to Keycloak (Docker)

1. Copy the `maritime` folder to your Keycloak themes directory:

```bash
# For Docker deployment
docker cp ./maritime <keycloak-container>:/opt/keycloak/themes/
```

Or mount as a volume in docker-compose:

```yaml
services:
  keycloak:
    image: quay.io/keycloak/keycloak:latest
    volumes:
      - ./keycloak-theme/maritime:/opt/keycloak/themes/maritime
```

2. Restart Keycloak if necessary.

### Option 2: Deploy to Keycloak (Standalone)

1. Copy the `maritime` folder to:
   - **Keycloak 17+**: `<KEYCLOAK_HOME>/themes/`
   - **Older versions**: `<KEYCLOAK_HOME>/standalone/configuration/themes/`

2. Restart Keycloak.

## Activate the Theme

1. Log in to Keycloak Admin Console
2. Select your Realm
3. Go to **Realm Settings** > **Themes**
4. Set **Login theme** to `maritime`
5. Click **Save**

## Theme Structure

```
maritime/
├── login/
│   ├── theme.properties      # Theme configuration
│   ├── login.ftl             # Login page template
│   ├── template.ftl          # Base template
│   └── resources/
│       ├── css/
│       │   └── login.css     # Custom styles
│       └── img/
│           ├── logo.svg      # TransTRACK logo
│           └── ship-illustration.svg  # Maritime ship illustration
```

## Customization

### Colors
Edit `resources/css/login.css` to change:
- Primary color (red): `#E53935`
- Background gradient: ocean blue gradient
- Button gradient: `#F87171` to `#EF4444`

### Logo
Replace `resources/img/logo.svg` with your own logo.

### Illustration
Replace `resources/img/ship-illustration.svg` with your own illustration.

### Text
Edit `login.ftl` to change:
- Page title: "Login To Maritime Solutions MS"
- Subtitle: "Hi, Welcome back to Maritime Solutions Management system."
- Version: "v0.0.88"

## Supported Pages

This theme customizes:
- Login page
- Error pages
- Password reset (uses default Keycloak styling with maritime colors)
- Registration (uses default Keycloak styling with maritime colors)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (responsive design)
