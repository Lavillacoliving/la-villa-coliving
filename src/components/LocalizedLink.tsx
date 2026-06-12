import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizePath } from "@/lib/localizedPath";

/**
 * <Link> conscient de la langue : préfixe automatiquement les chemins internes
 * par /en quand la langue courante est l'anglais. Remplace react-router Link
 * pour tous les liens internes du site public (les chemins restent écrits en
 * version FR neutre dans le code, ex. to="/candidature").
 */
export const LocalizedLink = forwardRef<HTMLAnchorElement, LinkProps>(
  function LocalizedLink({ to, ...rest }, ref) {
    const { language } = useLanguage();
    const localizedTo = typeof to === "string" ? localizePath(to, language) : to;
    return <Link ref={ref} to={localizedTo} {...rest} />;
  },
);
