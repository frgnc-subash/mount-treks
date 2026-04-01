import type { Locale } from "@/lib/i18n";

export type LegalSection = {
  title: string;
  paragraphs: string[];
};

type PrivacyPageContent = {
  metadataTitle: string;
  metadataDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  sectionsLabel: string;
  lastUpdated: string;
  lastUpdatedValue: string;
  noteTitle: string;
  noteDesc: string;
  termsButton: string;
  contactButton: string;
  guideButton: string;
  sections: LegalSection[];
};

type TermsPageContent = {
  metadataTitle: string;
  metadataDescription: string;
  heroBadge: string;
  heroTitle: string;
  heroDesc: string;
  sectionsLabel: string;
  lastUpdated: string;
  lastUpdatedValue: string;
  noteTitle: string;
  noteDesc: string;
  contactButton: string;
  privacyButton: string;
  browseButton: string;
  sections: LegalSection[];
};

type GuideMetadataContent = {
  title: string;
  description: string;
};

const guideMetadataContent: Record<Locale, GuideMetadataContent> = {
  en: {
    title: "Nepal Trek Planner",
    description:
      "Comprehensive Nepal trekking guide covering visas, gear, seasons, grade selection, insurance, health preparation, and route planning.",
  },
  es: {
    title: "Guía de Trekking en Nepal",
    description:
      "Guía completa de trekking en Nepal con visados, equipo, temporadas, niveles de ruta, seguros, salud y planificación del viaje.",
  },
  zh: {
    title: "尼泊尔徒步全攻略",
    description:
      "完整的尼泊尔徒步指南，涵盖签证、装备、季节、路线难度、保险、健康准备与行程规划。",
  },
};

const privacyPageContent: Record<Locale, PrivacyPageContent> = {
  en: {
    metadataTitle: "Privacy Policy",
    metadataDescription:
      "Read the Privacy Policy for Altigo Himalayan Treks, including how we collect, use, store, and protect your personal information.",
    heroBadge: "Privacy and Data",
    heroTitle: "Privacy Policy",
    heroDesc:
      "This policy explains how we collect, use, share, and protect your personal information, and the rights available to you.",
    sectionsLabel: "Policy Sections",
    lastUpdated: "Last updated",
    lastUpdatedValue: "March 27, 2026",
    noteTitle: "Security Notice",
    noteDesc:
      "We apply reasonable data-protection safeguards, but no internet transmission or storage method is completely secure.",
    termsButton: "View Terms of Service",
    contactButton: "Contact Us",
    guideButton: "View Trek Guide",
    sections: [
      {
        title: "1. Information We Collect",
        paragraphs: [
          "We collect information you submit directly, such as your name, email, phone number, travel preferences, and booking details.",
          "We may also collect technical data such as browser type, device information, pages visited, and cookie-based interaction data for service performance and analytics.",
        ],
      },
      {
        title: "2. How We Use Your Information",
        paragraphs: [
          "We use your data to process bookings, respond to inquiries, deliver trip support, send operational updates, and improve website experience.",
          "If you consent, we may send occasional marketing messages. You can opt out of promotional communication at any time.",
        ],
      },
      {
        title: "3. Legal Basis and Consent",
        paragraphs: [
          "We process personal information where necessary to perform requested services, comply with legal obligations, protect legitimate business interests, or based on your consent.",
          "When consent is used as the basis, you may withdraw it at any time, subject to legal or contractual limitations.",
        ],
      },
      {
        title: "4. Cookies and Tracking",
        paragraphs: [
          "We use essential cookies for core functionality and may use analytics cookies to understand site usage patterns.",
          "You can manage cookie preferences from our cookie banner and browser settings. Disabling some cookies may impact certain features.",
        ],
      },
      {
        title: "5. Information Sharing",
        paragraphs: [
          "We share data only when required to deliver services, such as with payment processors, accommodation providers, transport vendors, guides, and technical service providers.",
          "We may disclose information when legally required, to protect rights and safety, or in connection with business restructuring where permitted by law.",
        ],
      },
      {
        title: "6. Data Security",
        paragraphs: [
          "We apply reasonable administrative, technical, and organizational safeguards to protect personal information from unauthorized access, misuse, or disclosure.",
          "No internet transmission or storage system is perfectly secure. You share data at your own risk within the limits of applicable law.",
        ],
      },
      {
        title: "7. Data Retention",
        paragraphs: [
          "We keep personal information only for as long as needed for bookings, support, legal obligations, dispute handling, and legitimate business records.",
          "Retention periods may vary based on local legal requirements, tax rules, and operational needs.",
        ],
      },
      {
        title: "8. Your Rights",
        paragraphs: [
          "Depending on your jurisdiction, you may have rights to access, correct, delete, restrict, or object to certain processing of your personal data.",
          "To submit a request, contact us at info@altigohimalayantreks.com. We may require identity verification before fulfilling requests.",
        ],
      },
      {
        title: "9. Children's Privacy",
        paragraphs: [
          "Our website and services are not directed to children under the age required by applicable law for independent consent.",
          "If you believe a child has provided personal information without proper authorization, contact us so we can review and take appropriate action.",
        ],
      },
      {
        title: "10. Policy Updates and Contact",
        paragraphs: [
          "We may update this Privacy Policy from time to time. Changes become effective when posted on this page with an updated date.",
          "For privacy questions or requests, email us at info@altigohimalayantreks.com.",
        ],
      },
    ],
  },
  es: {
    metadataTitle: "Política de Privacidad",
    metadataDescription:
      "Lee la Política de Privacidad de Altigo Himalayan Treks y conoce cómo recopilamos, usamos, almacenamos y protegemos tu información personal.",
    heroBadge: "Privacidad y Datos",
    heroTitle: "Política de Privacidad",
    heroDesc:
      "Esta política explica cómo recopilamos, usamos, compartimos y protegemos tus datos personales, y qué derechos puedes ejercer.",
    sectionsLabel: "Secciones",
    lastUpdated: "Última actualización",
    lastUpdatedValue: "27 de marzo de 2026",
    noteTitle: "Aviso de Seguridad",
    noteDesc:
      "Aplicamos medidas razonables de seguridad, pero ninguna transmisión por internet es totalmente segura.",
    termsButton: "Ver Términos del Servicio",
    contactButton: "Contactar",
    guideButton: "Ver Guía de Trekking",
    sections: [
      {
        title: "1. Información que recopilamos",
        paragraphs: [
          "Recopilamos la información que nos envías directamente, como tu nombre, correo electrónico, número de teléfono, preferencias de viaje y datos de reserva.",
          "También podemos recopilar datos técnicos como tipo de navegador, información del dispositivo, páginas visitadas y datos de interacción basados en cookies para el rendimiento del servicio y análisis.",
        ],
      },
      {
        title: "2. Cómo usamos tu información",
        paragraphs: [
          "Usamos tus datos para procesar reservas, responder consultas, brindar apoyo para el viaje, enviar actualizaciones operativas y mejorar la experiencia del sitio web.",
          "Si das tu consentimiento, podemos enviarte mensajes promocionales ocasionales. Puedes darte de baja de las comunicaciones promocionales en cualquier momento.",
        ],
      },
      {
        title: "3. Base legal y consentimiento",
        paragraphs: [
          "Tratamos la información personal cuando es necesario para prestar los servicios solicitados, cumplir obligaciones legales, proteger intereses comerciales legítimos o con base en tu consentimiento.",
          "Cuando el consentimiento sea la base jurídica, podrás retirarlo en cualquier momento, sujeto a limitaciones legales o contractuales.",
        ],
      },
      {
        title: "4. Cookies y seguimiento",
        paragraphs: [
          "Usamos cookies esenciales para funciones básicas y también podemos usar cookies analíticas para comprender los patrones de uso del sitio.",
          "Puedes gestionar tus preferencias desde nuestro banner de cookies y la configuración del navegador. Desactivar algunas cookies puede afectar determinadas funciones.",
        ],
      },
      {
        title: "5. Compartición de información",
        paragraphs: [
          "Compartimos datos solo cuando es necesario para prestar el servicio, por ejemplo con procesadores de pago, alojamientos, proveedores de transporte, guías y proveedores técnicos.",
          "También podremos revelar información cuando la ley lo exija, para proteger derechos y seguridad, o en procesos de reorganización empresarial cuando la ley lo permita.",
        ],
      },
      {
        title: "6. Seguridad de los datos",
        paragraphs: [
          "Aplicamos medidas administrativas, técnicas y organizativas razonables para proteger la información personal frente a accesos no autorizados, uso indebido o divulgación.",
          "Ninguna transmisión por internet ni sistema de almacenamiento es perfectamente seguro. Compartes datos bajo tu propio riesgo dentro de los límites permitidos por la ley aplicable.",
        ],
      },
      {
        title: "7. Conservación de datos",
        paragraphs: [
          "Conservamos la información personal solo durante el tiempo necesario para reservas, asistencia, obligaciones legales, gestión de disputas y registros comerciales legítimos.",
          "Los plazos de conservación pueden variar según los requisitos legales locales, normas fiscales y necesidades operativas.",
        ],
      },
      {
        title: "8. Tus derechos",
        paragraphs: [
          "Según tu jurisdicción, puedes tener derecho a acceder, corregir, eliminar, restringir u oponerte a determinados tratamientos de tus datos personales.",
          "Para enviar una solicitud, contáctanos en info@altigohimalayantreks.com. Podemos requerir verificación de identidad antes de atenderla.",
        ],
      },
      {
        title: "9. Privacidad de menores",
        paragraphs: [
          "Nuestro sitio web y servicios no están dirigidos a menores de la edad exigida por la ley aplicable para prestar consentimiento independiente.",
          "Si crees que un menor ha proporcionado información personal sin la autorización adecuada, contáctanos para revisar la situación y tomar las medidas necesarias.",
        ],
      },
      {
        title: "10. Actualizaciones de la política y contacto",
        paragraphs: [
          "Podemos actualizar esta Política de Privacidad ocasionalmente. Los cambios entrarán en vigor cuando se publiquen en esta página con una fecha actualizada.",
          "Si tienes preguntas o solicitudes relacionadas con la privacidad, escríbenos a info@altigohimalayantreks.com.",
        ],
      },
    ],
  },
  zh: {
    metadataTitle: "隐私政策",
    metadataDescription:
      "阅读 Altigo Himalayan Treks 的隐私政策，了解我们如何收集、使用、存储并保护你的个人信息。",
    heroBadge: "隐私与数据",
    heroTitle: "隐私政策",
    heroDesc:
      "本政策说明我们如何收集、使用、共享和保护你的个人信息，以及你可行使的数据权利。",
    sectionsLabel: "政策目录",
    lastUpdated: "最近更新",
    lastUpdatedValue: "2026年3月27日",
    noteTitle: "数据安全提醒",
    noteDesc:
      "我们会采取合理的安全措施保护信息，但任何网络传输都无法保证绝对安全。",
    termsButton: "查看服务条款",
    contactButton: "联系我们",
    guideButton: "查看徒步指南",
    sections: [
      {
        title: "1. 我们收集的信息",
        paragraphs: [
          "我们会收集你直接提交的信息，例如姓名、电子邮箱、电话号码、旅行偏好以及预订详情。",
          "我们也可能收集技术数据，例如浏览器类型、设备信息、访问页面以及基于 Cookie 的交互数据，以用于服务性能和分析。",
        ],
      },
      {
        title: "2. 我们如何使用你的信息",
        paragraphs: [
          "我们使用你的数据来处理预订、回复咨询、提供行程支持、发送运营更新，并改进网站体验。",
          "在你同意的情况下，我们可能会发送不定期的营销信息。你可以随时取消接收推广通信。",
        ],
      },
      {
        title: "3. 法律依据与同意",
        paragraphs: [
          "当履行你所请求的服务、遵守法律义务、保护合法商业利益，或基于你的同意时，我们会处理个人信息。",
          "若以同意作为处理依据，你可以在任何时候撤回同意，但需遵守相关法律或合同限制。",
        ],
      },
      {
        title: "4. Cookie 与追踪",
        paragraphs: [
          "我们使用必要的 Cookie 来支持核心功能，也可能使用分析类 Cookie 了解网站使用情况。",
          "你可以通过我们的 Cookie 横幅和浏览器设置管理偏好。禁用部分 Cookie 可能会影响某些功能。",
        ],
      },
      {
        title: "5. 信息共享",
        paragraphs: [
          "我们仅在提供服务所必需时共享数据，例如与支付处理方、住宿提供商、交通供应商、向导和技术服务商共享。",
          "在法律要求、保护权利与安全，或法律允许的业务重组情况下，我们也可能披露相关信息。",
        ],
      },
      {
        title: "6. 数据安全",
        paragraphs: [
          "我们采取合理的管理、技术和组织措施，防止个人信息被未经授权访问、滥用或泄露。",
          "没有任何互联网传输或存储系统是绝对安全的。在适用法律允许的范围内，你需自行承担相关风险。",
        ],
      },
      {
        title: "7. 数据保存期限",
        paragraphs: [
          "我们仅在处理预订、提供支持、履行法律义务、处理争议及保留合法业务记录所需期间保存个人信息。",
          "保存期限可能因当地法律要求、税务规定和运营需求而有所不同。",
        ],
      },
      {
        title: "8. 你的权利",
        paragraphs: [
          "根据你所在司法辖区的规定，你可能享有访问、更正、删除、限制或反对部分个人数据处理的权利。",
          "如需提出申请，请发送邮件至 info@altigohimalayantreks.com。我们可能会在处理前要求进行身份验证。",
        ],
      },
      {
        title: "9. 儿童隐私",
        paragraphs: [
          "我们的网站和服务并非面向未达到适用法律规定的独立同意年龄的儿童。",
          "如果你认为儿童在未经适当授权的情况下提供了个人信息，请联系我们，以便我们进行审查并采取适当措施。",
        ],
      },
      {
        title: "10. 政策更新与联系",
        paragraphs: [
          "我们可能会不时更新本隐私政策。变更内容将在本页面发布并附带更新日期后生效。",
          "如有隐私相关问题或请求，请发送邮件至 info@altigohimalayantreks.com。",
        ],
      },
    ],
  },
};

const termsPageContent: Record<Locale, TermsPageContent> = {
  en: {
    metadataTitle: "Terms of Service",
    metadataDescription:
      "Read the Terms of Service for Altigo Himalayan Treks, including booking, payments, cancellations, liability, and traveler responsibilities.",
    heroBadge: "Legal and Terms",
    heroTitle: "Terms of Service",
    heroDesc:
      "Please review these terms before booking or using our services. They explain bookings, payments, cancellations, and responsibilities.",
    sectionsLabel: "Terms Sections",
    lastUpdated: "Last updated",
    lastUpdatedValue: "March 27, 2026",
    noteTitle: "Important Note",
    noteDesc:
      "High-altitude trekking involves natural risk. Choose routes based on your condition and maintain insurance that includes altitude trekking and evacuation.",
    contactButton: "Contact Us",
    privacyButton: "View Privacy Policy",
    browseButton: "Browse Destinations",
    sections: [
      {
        title: "1. Acceptance of Terms",
        paragraphs: [
          "By accessing this website or booking any trip, consultation, or service from Altigo Himalayan Treks, you agree to these Terms of Service.",
          "If you do not agree with any part of these terms, please do not use our website or services.",
        ],
      },
      {
        title: "2. Eligibility and Account Use",
        paragraphs: [
          "You must provide accurate, complete, and current information when creating an account or submitting a booking request.",
          "You are responsible for safeguarding your account credentials and for all activities that occur under your account.",
        ],
      },
      {
        title: "3. Booking, Pricing, and Payment",
        paragraphs: [
          "Trip prices, inclusions, and availability are displayed as accurately as possible but may change due to permits, transport, weather, or supplier costs.",
          "A booking is confirmed only after we send confirmation and receive the required payment or deposit according to your itinerary terms.",
          "You are responsible for transaction fees, foreign exchange charges, and any taxes or duties imposed by your payment provider or local authority.",
        ],
      },
      {
        title: "4. Cancellations and Changes",
        paragraphs: [
          "Cancellation and refund terms may differ by package, season, and supplier commitments. The terms shared at booking time apply to your reservation.",
          "Requests to change dates, routes, accommodations, or group composition are handled case by case and may involve additional costs.",
          "Force majeure events, including weather disruptions, natural hazards, government restrictions, or transport shutdowns, may require itinerary adjustments without liability for indirect losses.",
        ],
      },
      {
        title: "5. Health, Safety, and Trekking Responsibility",
        paragraphs: [
          "High-altitude trekking and expedition travel involve inherent risks. You are responsible for choosing trips suitable for your fitness, health condition, and prior experience.",
          "You should obtain medical advice before travel, carry required medications, disclose relevant health conditions, and follow guide instructions throughout the trip.",
          "Travel insurance covering high-altitude trekking and emergency evacuation is strongly recommended and may be required for specific itineraries.",
        ],
      },
      {
        title: "6. Liability Limitations",
        paragraphs: [
          "To the maximum extent permitted by law, Altigo Himalayan Treks is not liable for indirect, incidental, special, or consequential damages arising from website use or trip participation.",
          "Our total liability for any claim related to a booking is limited to the amount paid directly to us for the affected service, except where local law requires otherwise.",
        ],
      },
      {
        title: "7. Intellectual Property",
        paragraphs: [
          "All content on this website, including text, media, branding, and layout, is owned by or licensed to Altigo Himalayan Treks and is protected by applicable intellectual property laws.",
          "You may not reproduce, distribute, republish, or commercially exploit website content without prior written permission.",
        ],
      },
      {
        title: "8. Privacy and Data Handling",
        paragraphs: [
          "Use of personal information is governed by our Privacy Policy. By using this site, you consent to collection and use of data as described there.",
          "If there is a conflict between these Terms and our Privacy Policy regarding data practices, the Privacy Policy controls for that topic.",
        ],
      },
      {
        title: "9. Security and Prohibited Use",
        paragraphs: [
          "You agree not to misuse the website, attempt unauthorized access, disrupt platform operations, or submit malicious code or fraudulent information.",
          "We may suspend access, cancel bookings, or take legal action if misuse, abuse, or violations of these terms are identified.",
        ],
      },
      {
        title: "10. Governing Law and Contact",
        paragraphs: [
          "These terms are governed by the laws of Nepal unless otherwise required by mandatory consumer law in your country of residence.",
          "For questions about these terms, contact us at info@altigohimalayantreks.com.",
        ],
      },
    ],
  },
  es: {
    metadataTitle: "Términos del Servicio",
    metadataDescription:
      "Lee los Términos del Servicio de Altigo Himalayan Treks, incluidos reservas, pagos, cancelaciones, responsabilidad y obligaciones del viajero.",
    heroBadge: "Legal y Términos",
    heroTitle: "Términos del Servicio",
    heroDesc:
      "Revisa estos términos antes de reservar o usar nuestros servicios para conocer pagos, cambios, cancelaciones y límites de responsabilidad.",
    sectionsLabel: "Secciones",
    lastUpdated: "Última actualización",
    lastUpdatedValue: "27 de marzo de 2026",
    noteTitle: "Aviso Importante",
    noteDesc:
      "El trekking en altura implica riesgos naturales. Elige rutas según tu condición y usa seguro con cobertura de altura y evacuación.",
    contactButton: "Contactar",
    privacyButton: "Ver Política de Privacidad",
    browseButton: "Ver Destinos",
    sections: [
      {
        title: "1. Aceptación de los términos",
        paragraphs: [
          "Al acceder a este sitio web o reservar cualquier viaje, consulta o servicio de Altigo Himalayan Treks, aceptas estos Términos del Servicio.",
          "Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestro sitio web ni nuestros servicios.",
        ],
      },
      {
        title: "2. Requisitos y uso de la cuenta",
        paragraphs: [
          "Debes proporcionar información exacta, completa y actualizada al crear una cuenta o enviar una solicitud de reserva.",
          "Eres responsable de proteger las credenciales de tu cuenta y de toda actividad que ocurra bajo ella.",
        ],
      },
      {
        title: "3. Reservas, precios y pagos",
        paragraphs: [
          "Los precios, inclusiones y disponibilidad de los viajes se muestran con la mayor precisión posible, pero pueden cambiar por permisos, transporte, clima o costos de proveedores.",
          "Una reserva solo queda confirmada después de que enviemos la confirmación y recibamos el pago o depósito requerido según las condiciones de tu itinerario.",
          "Eres responsable de las comisiones de transacción, cargos por cambio de moneda y cualquier impuesto o tasa aplicada por tu proveedor de pago o autoridad local.",
        ],
      },
      {
        title: "4. Cancelaciones y cambios",
        paragraphs: [
          "Las condiciones de cancelación y reembolso pueden variar según el paquete, la temporada y los compromisos con proveedores. Se aplicarán las condiciones compartidas al momento de la reserva.",
          "Las solicitudes para cambiar fechas, rutas, alojamientos o composición del grupo se revisan caso por caso y pueden implicar costos adicionales.",
          "Los eventos de fuerza mayor, incluidos problemas climáticos, riesgos naturales, restricciones gubernamentales o interrupciones del transporte, pueden requerir ajustes del itinerario sin responsabilidad por pérdidas indirectas.",
        ],
      },
      {
        title: "5. Salud, seguridad y responsabilidad en el trekking",
        paragraphs: [
          "El trekking de altura y los viajes de expedición implican riesgos inherentes. Eres responsable de elegir viajes adecuados para tu forma física, condición de salud y experiencia previa.",
          "Debes buscar orientación médica antes del viaje, llevar los medicamentos necesarios, informar sobre condiciones de salud relevantes y seguir las instrucciones del guía durante todo el recorrido.",
          "Se recomienda firmemente contar con seguro de viaje que cubra trekking en altura y evacuación de emergencia, y puede ser obligatorio en algunos itinerarios.",
        ],
      },
      {
        title: "6. Limitaciones de responsabilidad",
        paragraphs: [
          "En la máxima medida permitida por la ley, Altigo Himalayan Treks no será responsable por daños indirectos, incidentales, especiales o consecuentes derivados del uso del sitio web o de la participación en el viaje.",
          "Nuestra responsabilidad total por cualquier reclamación relacionada con una reserva se limita al importe pagado directamente a nosotros por el servicio afectado, salvo que la ley local disponga lo contrario.",
        ],
      },
      {
        title: "7. Propiedad intelectual",
        paragraphs: [
          "Todo el contenido de este sitio web, incluidos textos, medios, marca y diseño, pertenece a Altigo Himalayan Treks o se utiliza bajo licencia, y está protegido por las leyes de propiedad intelectual aplicables.",
          "No puedes reproducir, distribuir, republicar ni explotar comercialmente el contenido del sitio sin autorización previa por escrito.",
        ],
      },
      {
        title: "8. Privacidad y tratamiento de datos",
        paragraphs: [
          "El uso de la información personal se rige por nuestra Política de Privacidad. Al usar este sitio, aceptas la recopilación y uso de datos según lo descrito allí.",
          "Si existe un conflicto entre estos Términos y nuestra Política de Privacidad en materia de datos, prevalecerá la Política de Privacidad para ese tema.",
        ],
      },
      {
        title: "9. Seguridad y uso prohibido",
        paragraphs: [
          "Aceptas no hacer un uso indebido del sitio web, intentar accesos no autorizados, interrumpir las operaciones de la plataforma ni enviar código malicioso o información fraudulenta.",
          "Podemos suspender el acceso, cancelar reservas o emprender acciones legales si detectamos uso indebido, abuso o incumplimiento de estos términos.",
        ],
      },
      {
        title: "10. Ley aplicable y contacto",
        paragraphs: [
          "Estos términos se rigen por las leyes de Nepal, salvo que la legislación imperativa de protección al consumidor de tu país de residencia disponga lo contrario.",
          "Si tienes preguntas sobre estos términos, escríbenos a info@altigohimalayantreks.com.",
        ],
      },
    ],
  },
  zh: {
    metadataTitle: "服务条款",
    metadataDescription:
      "阅读 Altigo Himalayan Treks 的服务条款，了解预订、付款、取消、责任范围及旅客义务。",
    heroBadge: "法律与条款",
    heroTitle: "服务条款",
    heroDesc:
      "请在预订徒步产品或使用网站服务前阅读本条款，了解预订、付款、改期、取消与责任范围。",
    sectionsLabel: "条款目录",
    lastUpdated: "最近更新",
    lastUpdatedValue: "2026年3月27日",
    noteTitle: "重要提示",
    noteDesc:
      "高海拔徒步存在自然风险。请根据自身情况选择线路，并确保保险覆盖高海拔徒步和紧急撤离。",
    contactButton: "联系我们",
    privacyButton: "查看隐私政策",
    browseButton: "浏览目的地",
    sections: [
      {
        title: "1. 条款接受",
        paragraphs: [
          "当你访问本网站或预订 Altigo Himalayan Treks 提供的任何行程、咨询或服务时，即表示你同意本服务条款。",
          "如果你不同意本条款的任何内容，请不要使用我们的网站或服务。",
        ],
      },
      {
        title: "2. 资格与账户使用",
        paragraphs: [
          "在创建账户或提交预订申请时，你必须提供准确、完整且最新的信息。",
          "你有责任妥善保管账户凭证，并对账户下发生的所有活动负责。",
        ],
      },
      {
        title: "3. 预订、价格与付款",
        paragraphs: [
          "我们会尽量准确展示行程价格、包含内容和可用性，但这些信息可能因许可、交通、天气或供应商成本而变化。",
          "只有在我们发送确认并收到行程条款要求的付款或定金后，预订才算正式成立。",
          "你需承担支付服务商或当地主管部门收取的交易手续费、汇率费用以及相关税费。",
        ],
      },
      {
        title: "4. 取消与变更",
        paragraphs: [
          "取消和退款条款可能因产品、季节和供应商承诺而不同。预订时告知你的条款将适用于该订单。",
          "更改日期、路线、住宿或团队人数的请求将按个案处理，并可能产生额外费用。",
          "不可抗力事件，包括天气中断、自然灾害、政府限制或交通停运，可能导致行程调整，我们对由此产生的间接损失不承担责任。",
        ],
      },
      {
        title: "5. 健康、安全与徒步责任",
        paragraphs: [
          "高海拔徒步和探险旅行本身存在固有风险。你有责任根据自己的体能、健康状况和过往经验选择合适的行程。",
          "出发前你应咨询医生、携带所需药物、如实告知相关健康情况，并在整个行程中遵循向导指示。",
          "我们强烈建议购买涵盖高海拔徒步和紧急撤离的旅行保险，部分行程可能将此作为必需条件。",
        ],
      },
      {
        title: "6. 责任限制",
        paragraphs: [
          "在法律允许的最大范围内，Altigo Himalayan Treks 不对因使用网站或参加行程而产生的间接、附带、特殊或后果性损失承担责任。",
          "除当地法律另有强制规定外，我们对与预订相关的任何索赔所承担的总责任，以你直接支付给我们的受影响服务金额为限。",
        ],
      },
      {
        title: "7. 知识产权",
        paragraphs: [
          "本网站上的所有内容，包括文字、媒体、品牌和版式，均归 Altigo Himalayan Treks 所有或经授权使用，并受适用知识产权法律保护。",
          "未经事先书面许可，你不得复制、分发、再发布或将网站内容用于商业用途。",
        ],
      },
      {
        title: "8. 隐私与数据处理",
        paragraphs: [
          "个人信息的使用受我们的隐私政策约束。使用本网站即表示你同意按照隐私政策所述方式收集和使用数据。",
          "如果本条款与隐私政策在数据处理方面存在冲突，则以隐私政策为准。",
        ],
      },
      {
        title: "9. 安全与禁止行为",
        paragraphs: [
          "你同意不会滥用本网站、尝试未经授权的访问、破坏平台运行，或提交恶意代码及欺诈性信息。",
          "如发现滥用、违规或违反本条款的行为，我们可暂停访问、取消预订或采取法律行动。",
        ],
      },
      {
        title: "10. 适用法律与联系",
        paragraphs: [
          "除你所在国家/地区的强制性消费者保护法律另有要求外，本条款受尼泊尔法律管辖。",
          "如对本条款有任何疑问，请发送邮件至 info@altigohimalayantreks.com。",
        ],
      },
    ],
  },
};

export function getGuideMetadataCopy(locale: Locale) {
  return guideMetadataContent[locale];
}

export function getPrivacyPageContent(locale: Locale) {
  return privacyPageContent[locale];
}

export function getTermsPageContent(locale: Locale) {
  return termsPageContent[locale];
}
