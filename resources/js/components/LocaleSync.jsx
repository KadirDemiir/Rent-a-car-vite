import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

/**
 * Component to sync i18n language AND translations with Inertia props
 * Updates on every page navigation
 */
export default function LocaleSync() {
    const { locale, translations } = usePage().props;
    const { i18n } = useTranslation();

    useEffect(() => {
        if (!locale) return;

        // Add/update translations for this locale
        if (translations && Object.keys(translations).length > 0) {
            i18n.addResourceBundle(locale, 'translation', translations, true, true);
        }

        // Change language if needed
        if (i18n.language !== locale) {
            i18n.changeLanguage(locale);
        }
    }, [locale, translations, i18n]);

    return null;
}