import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

/**
 * Component to sync i18n language with Laravel locale from Inertia props
 * Updates language on every page navigation
 */
/* export default function LocaleSync() {
    const { locale } = usePage().props;
    const { i18n } = useTranslation();

    useEffect(() => {
        if (locale && i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);

    return null;
}
 */