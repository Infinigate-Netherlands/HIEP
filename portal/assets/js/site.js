'use strict';

// Proposed public copy, including translations, requires publication review.
const translations = {
    "en": {
        "page.title": "HIEP | Healthcare Identity Eco Platform",
        "page.description": "An open project for healthcare identity architecture, standards and knowledge sharing.",
        "nav.label": "Main navigation",
        "nav.about": "About",
        "nav.status": "Status",
        "nav.updates": "Updates",
        "nav.roadmap": "Roadmap",
        "nav.resources": "Resources",
        "language.label": "Language",
        "skip": "Skip to content",
        "hero.title": "Identity architecture for modern healthcare.",
        "hero.intro": "HIEP is an open project for practical identity architecture, standards, guidance and reusable building blocks for healthcare.",
        "hero.updates": "Project updates",
        "hero.resources": "Explore the project",
        "brand.line": "Initiated and powered by Infinigate Netherlands",
        "brand.label": "Collaboration",
        "brand.title": "Why Infinigate supports HIEP",
        "brand.intro": "Secure digital identity helps healthcare organizations work together. Infinigate supports HIEP as a place to share knowledge and develop reusable architectures and standards.",
        "brand.collaboration": "The aim is vendor-neutral collaboration on interoperability between healthcare organizations, government and technology partners.",
        "brand.scope": "HIEP is a collaborative knowledge project, not a commercial Infinigate product. Published material should be assessed for its stated scope and maturity.",
        "status.label": "Project status",
        "status.title": "A working foundation. Further work ahead.",
        "status.intro": "The repository, tooling foundation, Project Update framework, timeline generation and public portal infrastructure are implemented. The repository has moved to the Infinigate Netherlands GitHub Organization.",
        "status.deployment": "Checked 18 November 2026: the Pages workflow is disabled manually. The site remains reachable; the last successful deployment was 23 September 2026. New CI execution has not yet been demonstrated.",
        "status.note": "Implementation is separate from formal acceptance. No completion percentage or v1.0 release approval is claimed.",
        "state.complete": "Completed",
        "state.progress": "In progress",
        "state.planned": "Planned",
        "state.approval": "Awaiting approval",
        "status.complete": "Organization migration, metadata and bootstrap corrections, CI separation and the public README baseline are complete; CI runtime remains unverified.",
        "status.progress": "Bilingual portal review and controlled handover preparation.",
        "status.planned": "Controlled CI validation, contributor guidance and reference integration documentation; local/private distribution and live AI/MCP integrations remain planned.",
        "status.approval": "Publication policy and release-scope decisions remain pending; Draft material is not approved policy.",
        "timeline.label": "Project timeline",
        "timeline.title": "Published project history",
        "timeline.note": "Project Updates document recorded milestones. Translations do not change historical source records.",
        "timeline.loading": "Loading project updates…",
        "timeline.count": "Loaded {count} project updates.",
        "timeline.empty": "No project updates are available yet.",
        "timeline.error": "Project timeline is currently unavailable.",
        "timeline.source": "This update is shown in its original English; a Dutch translation is not yet available.",
        "roadmap.label": "Roadmap",
        "roadmap.title": "Next steps, with explicit decision points",
        "roadmap.complete": "Repository migration, tooling, update framework and portal infrastructure.",
        "roadmap.progress": "Validate the merged CI configuration separately and review bilingual portal content before publication.",
        "roadmap.planned": "Improve reference guidance and documentation; authorize any new Project Updates separately.",
        "roadmap.approval": "Establish delegated authority and publication eligibility before enforcing governance gates.",
        "architecture.label": "Architecture and security",
        "architecture.title": "Principles guide the work",
        "architecture.intro": "Existing architecture principles address identity, explicit verification, least privilege, trust, resilience and data protection. Detailed designs require their own review; Draft material is not approved policy.",
        "architecture.link": "Read the architecture principles",
        "resources.label": "Project resources",
        "resources.title": "Explore HIEP",
        "resources.repo": "Source repository",
        "resources.roadmap": "Read the roadmap",
        "resources.standards": "Explore project standards",
        "review.note": "Proposed portal content — publication review pending.",
        "footer.visit": "Visit Infinigate Netherlands",
        "noscript": "JavaScript enables language switching and the project timeline. The English overview remains available without it.",
        "timeline.original": "This update is available in English only."
    },
    "nl": {
        "page.title": "HIEP | Healthcare Identity Eco Platform",
        "page.description": "Een open project voor identiteitsarchitectuur, standaarden en kennisdeling in de zorg.",
        "nav.label": "Hoofdnavigatie",
        "nav.about": "Over HIEP",
        "nav.status": "Status",
        "nav.updates": "Updates",
        "nav.roadmap": "Routekaart",
        "nav.resources": "Bronnen",
        "language.label": "Taal",
        "skip": "Ga naar de inhoud",
        "hero.title": "Identiteitsarchitectuur voor de zorg van vandaag.",
        "hero.intro": "HIEP is een open project voor praktische identiteitsarchitectuur, standaarden, richtlijnen en herbruikbare bouwstenen voor de zorg.",
        "hero.updates": "Projectupdates",
        "hero.resources": "Verken het project",
        "brand.line": "Geïnitieerd en ondersteund door Infinigate Netherlands",
        "brand.label": "Samenwerking",
        "brand.title": "Waarom Infinigate HIEP ondersteunt",
        "brand.intro": "Veilige digitale identiteit helpt zorgorganisaties samen te werken. Infinigate ondersteunt HIEP als plek om kennis te delen en herbruikbare architecturen en standaarden te ontwikkelen.",
        "brand.collaboration": "Het doel is leveranciersonafhankelijke samenwerking aan interoperabiliteit tussen zorgorganisaties, overheid en technologiepartners.",
        "brand.scope": "HIEP is een gezamenlijk kennisproject, geen commercieel Infinigate-product. Beoordeel gepubliceerd materiaal op de aangegeven reikwijdte en volwassenheid.",
        "status.label": "Projectstatus",
        "status.title": "Een werkende basis. Verdere ontwikkeling volgt.",
        "status.intro": "De repository, basis van de tooling, het projectupdate-framework, de tijdlijngeneratie en de infrastructuur van het publieke portaal zijn gerealiseerd. De repository is overgezet naar de GitHub-organisatie van Infinigate Netherlands.",
        "status.deployment": "Gecontroleerd op 18 november 2026: de Pages-workflow is handmatig uitgeschakeld. De site blijft bereikbaar; de laatste geslaagde deployment was op 23 september 2026. Uitvoering van de nieuwe CI is nog niet aangetoond.",
        "status.note": "Implementatie staat los van formele acceptatie. Er wordt geen voltooiingspercentage of goedgekeurde v1.0-release geclaimd.",
        "state.complete": "Afgerond",
        "state.progress": "In ontwikkeling",
        "state.planned": "Gepland",
        "state.approval": "Wacht op goedkeuring",
        "status.complete": "Organisatiemigratie, metadata- en bootstrapcorrecties, CI-scheiding en de publieke README-basis zijn afgerond; uitvoering van CI is nog niet aangetoond.",
        "status.progress": "Beoordeling van het tweetalige portaal en voorbereiding van een beheerste overdracht.",
        "status.planned": "Beheerste CI-validatie, bijdragerichtlijnen en documentatie voor een referentie-integratie; lokale/private distributie en live AI/MCP-integraties blijven gepland.",
        "status.approval": "Besluiten over publicatiebeleid en releasescope staan nog open; conceptmateriaal is geen goedgekeurd beleid.",
        "timeline.label": "Projecttijdlijn",
        "timeline.title": "Gepubliceerde projectgeschiedenis",
        "timeline.note": "Projectupdates documenteren vastgelegde mijlpalen. Vertalingen veranderen historische bronregistraties niet.",
        "timeline.loading": "Projectupdates laden…",
        "timeline.count": "{count} projectupdates geladen.",
        "timeline.empty": "Er zijn nog geen projectupdates beschikbaar.",
        "timeline.error": "De projecttijdlijn is momenteel niet beschikbaar.",
        "timeline.source": "Deze update wordt in het oorspronkelijke Engels getoond; een Nederlandse vertaling is nog niet beschikbaar.",
        "roadmap.label": "Routekaart",
        "roadmap.title": "Vervolgstappen met expliciete beslismomenten",
        "roadmap.complete": "Repositorymigratie, tooling, update-framework en portaalinfrastructuur.",
        "roadmap.progress": "De gemergede CI-configuratie afzonderlijk valideren en tweetalige portaalinhoud beoordelen voor publicatie.",
        "roadmap.planned": "Referentierichtlijnen en documentatie verbeteren; eventuele nieuwe projectupdates afzonderlijk autoriseren.",
        "roadmap.approval": "Gedelegeerde bevoegdheden en publicatiegeschiktheid vaststellen voordat governancecontroles verplicht worden.",
        "architecture.label": "Architectuur en beveiliging",
        "architecture.title": "Principes geven richting",
        "architecture.intro": "Bestaande architectuurprincipes behandelen identiteit, expliciete verificatie, minimale bevoegdheden, vertrouwen, weerbaarheid en gegevensbescherming. Gedetailleerde ontwerpen vereisen eigen beoordeling; conceptmateriaal is geen goedgekeurd beleid.",
        "architecture.link": "Lees de architectuurprincipes",
        "resources.label": "Projectbronnen",
        "resources.title": "Verken HIEP",
        "resources.repo": "Bronrepository",
        "resources.roadmap": "Lees de routekaart",
        "resources.standards": "Bekijk de projectstandaarden",
        "review.note": "Voorgestelde portaalinhoud — publicatiebeoordeling volgt.",
        "footer.visit": "Bezoek Infinigate Netherlands",
        "noscript": "JavaScript maakt taalkeuze en de projecttijdlijn mogelijk. Het Engelse overzicht blijft zonder JavaScript beschikbaar.",
        "timeline.original": "Deze update is alleen in het Engels beschikbaar."
    }
};
const timelineDutch = {
    "HIEP-UPD-0009": {
        "sourceTitle": "HIEP public portal expanded with project transparency",
        "sourceSummary": "The HIEP public portal now provides a clearer project overview, roadmap, current project status, project resources, architecture and security development status, and Infinigate branding.",
        "title": "Publiek HIEP-portaal uitgebreid met projecttransparantie",
        "summary": "Het publieke HIEP-portaal biedt nu een duidelijker projectoverzicht, een routekaart, de actuele projectstatus, projectbronnen, de ontwikkelstatus van architectuur en beveiliging en Infinigate-branding."
    },
    "HIEP-UPD-0008": {
        "sourceTitle": "HIEP public project portal launched",
        "sourceSummary": "The HIEP public project portal is now live through GitHub Pages, with automated validation, timeline generation and deployment from the repository.",
        "title": "Publiek HIEP-projectportaal gelanceerd",
        "summary": "Het publieke HIEP-projectportaal is beschikbaar via GitHub Pages, met geautomatiseerde validatie, tijdlijngeneratie en deployment vanuit de repository."
    },
    "HIEP-UPD-0007": {
        "sourceTitle": "Project Update creation tooling implemented",
        "sourceSummary": "HIEP can now create structured Project Updates through its PowerShell tooling.",
        "title": "Tooling voor het maken van projectupdates geïmplementeerd",
        "summary": "HIEP kan nu gestructureerde projectupdates maken met de PowerShell-tooling."
    },
    "HIEP-UPD-0006": {
        "sourceTitle": "HIEP Project Update framework introduced",
        "sourceSummary": "HIEP introduced a structured Project Update framework as the editorial source for chronological project history and future portal timelines.",
        "title": "HIEP-projectupdate-framework geïntroduceerd",
        "summary": "HIEP heeft een gestructureerd projectupdate-framework geïntroduceerd als redactionele bron voor de chronologische projectgeschiedenis en toekomstige portaaltijdlijnen."
    },
    "HIEP-UPD-0005": {
        "sourceTitle": "HIEP document ID allocation implemented",
        "sourceSummary": "HIEP introduced automatic identifier allocation for managed documents based on configured document types and existing repository content.",
        "title": "Toewijzing van HIEP-document-ID’s geïmplementeerd",
        "summary": "HIEP heeft automatische ID-toewijzing voor beheerde documenten toegevoegd op basis van geconfigureerde documenttypen en bestaande repository-inhoud."
    },
    "HIEP-UPD-0004": {
        "sourceTitle": "HIEP managed document system established",
        "sourceSummary": "HIEP established its managed document system with document type configuration, standardized templates, repository helpers, and metadata parsing.",
        "title": "HIEP-systeem voor beheerde documenten ingericht",
        "summary": "HIEP heeft het systeem voor beheerde documenten ingericht met documenttypeconfiguratie, gestandaardiseerde sjablonen, repositoryhulpfuncties en metadataverwerking."
    },
    "HIEP-UPD-0003": {
        "sourceTitle": "HIEP document framework established",
        "sourceSummary": "HIEP established its initial documentation framework covering document management, Markdown, Mermaid diagrams, and PowerShell automation conventions.",
        "title": "HIEP-documentatieframework ingericht",
        "summary": "HIEP heeft een eerste documentatieframework ingericht voor documentbeheer, Markdown, Mermaid-diagrammen en PowerShell-automatisering."
    },
    "HIEP-UPD-0002": {
        "sourceTitle": "HIEP repository foundation established",
        "sourceSummary": "The HIEP repository was transformed into a structured development environment with bootstrap configuration, repository conventions, and initial project templates.",
        "title": "Basis van de HIEP-repository ingericht",
        "summary": "De HIEP-repository is ingericht als een gestructureerde ontwikkelomgeving met bootstrapconfiguratie, repositoryconventies en eerste projectsjablonen."
    },
    "HIEP-UPD-0001": {
        "sourceTitle": "Healthcare Identity Eco Platform repository established",
        "sourceSummary": "The Healthcare Identity Eco Platform repository was established, creating the Git-based foundation for the development and documentation of HIEP.",
        "title": "HIEP-repository opgericht",
        "summary": "De repository voor het Healthcare Identity Eco Platform is opgericht als Git-basis voor de ontwikkeling en documentatie van HIEP."
    }
};
const typeLabels = {
    en: { development: 'Development', documentation: 'Documentation', architecture: 'Architecture', governance: 'Governance', research: 'Research', release: 'Release', milestone: 'Milestone' },
    nl: { development: 'Ontwikkeling', documentation: 'Documentatie', architecture: 'Architectuur', governance: 'Governance', research: 'Onderzoek', release: 'Release', milestone: 'Mijlpaal' }
};
const statusLabels = {
    en: { planned: 'Planned', 'in-progress': 'In progress', completed: 'Completed', cancelled: 'Cancelled', superseded: 'Superseded' },
    nl: { planned: 'Gepland', 'in-progress': 'In ontwikkeling', completed: 'Afgerond', cancelled: 'Geannuleerd', superseded: 'Vervangen' }
};
const timelineElement = document.getElementById('timeline');
const timelineCountElement = document.getElementById('timeline-count');
let language = 'en';
let timelineUpdates = [];
let timelineState = 'loading';

function translate(key) {
    return translations[language][key] || translations.en[key];
}

function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function renderTimeline() {
    // Count only successfully loaded entries; optional JSON count metadata is not authoritative.
    timelineCountElement.hidden = timelineState !== 'ready';
    timelineCountElement.textContent = timelineState === 'ready'
        ? translate('timeline.count').replace('{count}', String(timelineUpdates.length))
        : '';
    timelineElement.replaceChildren();
    timelineElement.setAttribute('aria-busy', String(timelineState === 'loading'));
    if (timelineState !== 'ready' || timelineUpdates.length === 0) {
        const key = timelineState === 'ready' ? 'timeline.empty' : 'timeline.' + timelineState;
        timelineElement.append(createElement('p', null, translate(key)));
        return;
    }
    for (const update of timelineUpdates) {
        const article = createElement('article', 'timeline-item');
        const meta = createElement('div', 'timeline-meta');
        const date = createElement('time', null, update.date);
        date.setAttribute('datetime', update.date);
        meta.append(
            date,
            createElement('span', null, typeLabels[language][update.type] || update.type),
            createElement('span', null, statusLabels[language][update.status] || update.status),
            createElement('span', null, update.id)
        );
        // Never reuse a translation after the canonical wording changes.
        const candidate = timelineDutch[update.id];
        const localized = language === 'nl' && candidate &&
            candidate.sourceTitle === update.title && candidate.sourceSummary === update.summary;
        const title = createElement('h3', null, localized ? candidate.title : update.title);
        const summary = createElement('p', null, localized ? candidate.summary : update.summary);
        title.setAttribute('lang', localized ? 'nl' : 'en');
        summary.setAttribute('lang', localized ? 'nl' : 'en');
        article.append(meta, title, summary);
        if (language === 'nl' && !localized) {
            article.append(createElement('p', 'translation-note', translate('timeline.original')));
        }
        timelineElement.append(article);
    }
}

function setLanguage(nextLanguage) {
    language = nextLanguage === 'nl' ? 'nl' : 'en';
    document.documentElement.lang = language;
    document.title = translate('page.title');
    document.querySelectorAll('[data-i18n]').forEach(element => {
        element.textContent = translate(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
        element.setAttribute('aria-label', translate(element.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-content]').forEach(element => {
        element.setAttribute('content', translate(element.dataset.i18nContent));
    });
    document.querySelectorAll('[data-language]').forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.language === language));
    });
    renderTimeline();
}

async function loadTimeline() {
    try {
        const response = await fetch('data/timeline.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Timeline request failed.');
        const timeline = await response.json();
        if (!Array.isArray(timeline.updates) || !timeline.updates.every(update =>
            update && ['id', 'title', 'date', 'type', 'status', 'summary'].every(key =>
                typeof update[key] === 'string'))) {
            throw new Error('Invalid timeline data.');
        }
        timelineUpdates = timeline.updates;
        timelineState = 'ready';
    } catch {
        // Do not expose fetched content in error messages or logs.
        timelineUpdates = [];
        timelineState = 'error';
    }
    renderTimeline();
}

try {
    const savedLanguage = window.localStorage.getItem('hiep.language');
    language = savedLanguage === 'nl' ? 'nl' : 'en';
} catch {
    // Language selection remains available when browser storage is blocked.
}
document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
        setLanguage(button.dataset.language);
        try { window.localStorage.setItem('hiep.language', language); } catch { /* Optional storage. */ }
    });
});
document.querySelector('.language-switcher').hidden = false;
setLanguage(language);
loadTimeline();
