# Políticas de Privacidad y Términos de Uso

**Plataforma:** Explo — Plataforma de Gestión Inmobiliaria  
**Versión:** 1.0  
**Fecha de última actualización:** 6 de mayo de 2026  
**Ámbito territorial:** República de Chile

---

## Índice

1. [Identificación del Responsable](#1-identificación-del-responsable)
2. [Ámbito de Aplicación](#2-ámbito-de-aplicación)
3. [Marco Legal Aplicable](#3-marco-legal-aplicable)
4. [Datos Personales que Recopilamos](#4-datos-personales-que-recopilamos)
5. [Finalidades del Tratamiento](#5-finalidades-del-tratamiento)
6. [Base de Legitimidad del Tratamiento](#6-base-de-legitimidad-del-tratamiento)
7. [Conservación de los Datos](#7-conservación-de-los-datos)
8. [Comunicación y Transferencia de Datos a Terceros](#8-comunicación-y-transferencia-de-datos-a-terceros)
9. [Transferencias Internacionales de Datos](#9-transferencias-internacionales-de-datos)
10. [Derechos del Titular](#10-derechos-del-titular)
11. [Medidas de Seguridad](#11-medidas-de-seguridad)
12. [Cookies, Almacenamiento Local y Sesiones](#12-cookies-almacenamiento-local-y-sesiones)
13. [Notificaciones y Comunicaciones](#13-notificaciones-y-comunicaciones)
14. [Términos de Uso de la Plataforma](#14-términos-de-uso-de-la-plataforma)
15. [Modificaciones a estas Políticas](#15-modificaciones-a-estas-políticas)
16. [Contacto y Ejercicio de Derechos](#16-contacto-y-ejercicio-de-derechos)

---

## 1. Identificación del Responsable

**Explo** (en adelante, "la Plataforma", "nosotros" o "el Responsable") es una plataforma digital de gestión inmobiliaria desarrollada para corredores y agentes de propiedades en Chile. Opera como responsable del tratamiento de los datos personales recopilados a través de la aplicación web accesible en sus dominios correspondientes.

Para efectos de lo dispuesto en la **Ley N° 21.719 sobre Protección de Datos Personales** y la **Ley N° 19.628 sobre Protección de la Vida Privada**, el Responsable del tratamiento es quien se individualiza en la sección de contacto de este documento.

---

## 2. Ámbito de Aplicación

Estas Políticas de Privacidad y Términos de Uso aplican a:

- Todos los usuarios registrados en la Plataforma (agentes inmobiliarios, corredores de propiedades).
- Los datos de personas naturales ingresados por los usuarios en calidad de propietarios, arrendatarios o contactos relacionados a propiedades (terceros cuyos datos son tratados en el contexto del servicio).
- Toda información recopilada de forma automática durante el uso de la Plataforma.

Estas políticas **no aplican** a sitios web de terceros a los que pueda accederse mediante vínculos contenidos en la Plataforma.

---

## 3. Marco Legal Aplicable

El tratamiento de datos personales realizado por Explo se rige por la normativa vigente en Chile:

### 3.1 Ley N° 21.719 — Nueva Ley de Protección de Datos Personales

Publicada en el Diario Oficial el 13 de diciembre de 2023 y plenamente vigente, esta ley constituye el principal marco normativo aplicable. Establece:

- El principio de **licitud y lealtad** en el tratamiento.
- El principio de **finalidad**: los datos solo pueden tratarse para fines específicos, explícitos y legítimos.
- El principio de **proporcionalidad y minimización**: solo se recopilan los datos estrictamente necesarios.
- El principio de **exactitud**: los datos deben mantenerse actualizados y correctos.
- El principio de **seguridad**: se implementan medidas técnicas y organizativas adecuadas.
- Los **derechos ARCO ampliados**: acceso, rectificación, cancelación/supresión, oposición, portabilidad y no ser objeto de decisiones automatizadas.
- La **Agencia de Protección de Datos Personales (APDP)** como autoridad de control.
- La obligación de notificar **brechas de seguridad** a la APDP y a los titulares dentro de los plazos establecidos por ley.

### 3.2 Ley N° 19.628 — Ley sobre Protección de la Vida Privada

Aplicable en lo que no sea derogado por la Ley N° 21.719, especialmente en lo relativo al tratamiento de datos de terceras personas ingresadas a la plataforma por los usuarios.

### 3.3 Normativa complementaria

- Ley N° 19.496 — Protección de los Derechos de los Consumidores (en su aplicación digital).
- Ley N° 19.799 — Documentos Electrónicos, Firma Electrónica y Servicios de Certificación.
- Ley N° 21.459 — Delitos Informáticos.

---

## 4. Datos Personales que Recopilamos

### 4.1 Datos de registro y autenticación de usuarios

Al crear una cuenta o acceder a la Plataforma, recopilamos:

- Nombre completo y correo electrónico.
- Credenciales de acceso (contraseña, gestionada a través del proveedor de identidad Keycloak).
- Código de verificación de doble factor (2FA) enviado al correo.
- Token JWT de sesión, almacenado localmente en el navegador del usuario.
- Rol asignado dentro de la plataforma (agente, corredor, administrador).

### 4.2 Datos de terceros ingresados por el usuario

En el ejercicio de su actividad profesional, los usuarios ingresan datos de personas relacionadas a propiedades. Estos datos incluyen:

**De propietarios y arrendatarios (entidad "Personas"):**
- Nombre completo, RUT u otro identificador.
- Información de contacto: teléfono, correo electrónico.
- Número de cuenta bancaria u otros datos financieros necesarios para el registro de transacciones.

**De propiedades:**
- Dirección, coordenadas geográficas y descripción del inmueble.
- Información financiera: montos de arriendo, estado de pagos, utilidades, gastos comunes.
- Documentos digitales: contratos, certificados, imágenes y otros archivos adjuntos.
- Fechas de vencimiento de contratos, revisiones programadas y fechas de pago.

### 4.3 Datos recopilados automáticamente

- Registros de actividad (logs) dentro de la plataforma para fines de auditoría y seguridad.
- Eventos de notificación y alertas generados por el sistema.
- Datos de conexión al servicio de notificaciones en tiempo real (WebSocket).

---

## 5. Finalidades del Tratamiento

Los datos personales recopilados son tratados para las siguientes finalidades:

| Finalidad | Descripción |
|-----------|-------------|
| Autenticación y control de acceso | Verificar la identidad del usuario y gestionar el acceso seguro a la plataforma mediante JWT y doble factor de autenticación. |
| Gestión operativa inmobiliaria | Permitir al usuario administrar propiedades, contratos, pagos y personas asociadas. |
| Alertas y recordatorios automáticos | Detectar y notificar condiciones críticas como pagos atrasados, contratos por vencer y revisiones programadas, mediante cron jobs diarios. |
| Notificaciones en tiempo real | Informar al usuario sobre eventos relevantes de su portafolio a través de la plataforma y mensajería (WhatsApp). |
| Generación de estadísticas y reportes | Agregar datos para mostrar indicadores de rendimiento del portafolio al propio usuario. |
| Almacenamiento de documentos | Conservar imágenes y documentos asociados a propiedades en infraestructura segura en la nube. |
| Seguridad e integridad del sistema | Prevenir accesos no autorizados, detectar incidentes y garantizar la continuidad del servicio. |

Los datos **no serán utilizados** para finalidades incompatibles con las descritas, ni para perfilamiento con fines publicitarios de terceros, ni para toma de decisiones automatizadas con efectos jurídicos sobre los titulares.

---

## 6. Base de Legitimidad del Tratamiento

De conformidad con la Ley N° 21.719, el tratamiento de datos personales por parte de Explo descansa en las siguientes bases de licitud:

- **Ejecución de un contrato:** el tratamiento es necesario para la prestación del servicio contratado por el usuario al aceptar estos Términos de Uso.
- **Consentimiento del titular:** para el envío de comunicaciones por WhatsApp y para el tratamiento de datos sensibles, cuando corresponda, se recabará consentimiento expreso.
- **Interés legítimo:** para el mantenimiento de la seguridad del sistema, la prevención del fraude y la mejora del servicio, cuando dicho interés no sea superado por los derechos y libertades del titular.
- **Cumplimiento de obligación legal:** cuando el tratamiento sea requerido por la normativa chilena vigente.

Respecto de los **datos de terceros** (propietarios y arrendatarios) ingresados por los usuarios, el usuario actúa como responsable de tratamiento en su relación con esas personas y asume la responsabilidad de contar con una base de licitud adecuada para su ingreso a la plataforma. Explo actúa en ese caso como **encargado de tratamiento**, limitándose a procesar dichos datos según las instrucciones del usuario.

---

## 7. Conservación de los Datos

Los datos personales serán conservados durante el tiempo necesario para cumplir las finalidades para las que fueron recopilados y, en todo caso:

- **Datos de cuenta de usuario:** mientras la cuenta permanezca activa. Tras la solicitud de eliminación, se suprimirán en un plazo máximo de 30 días hábiles, salvo obligación legal de conservación.
- **Datos de propiedades, contratos y transacciones:** por el período que el usuario mantenga dichos registros activos en la plataforma, más el período de prescripción aplicable conforme a la normativa civil y tributaria chilena (generalmente 5 años desde el último acto).
- **Documentos almacenados en AWS S3:** se conservarán vinculados a la cuenta activa; se eliminarán conforme a la solicitud del usuario o cierre de cuenta.
- **Logs de seguridad y auditoría:** hasta 12 meses desde su generación.

Transcurridos los plazos anteriores, los datos serán suprimidos o anonimizados de forma irreversible.

---

## 8. Comunicación y Transferencia de Datos a Terceros

Explo no vende, cede ni comercializa datos personales a terceros con fines propios. Los datos podrán ser comunicados únicamente en los siguientes casos:

### 8.1 Proveedores de servicios (encargados de tratamiento)

| Proveedor | Servicio | Datos tratados |
|-----------|----------|----------------|
| **Amazon Web Services (AWS S3)** | Almacenamiento de documentos e imágenes | Archivos subidos por el usuario |
| **Keycloak** | Gestión de identidad y autenticación | Credenciales de acceso, tokens JWT |
| **Proveedor de WhatsApp Business API** | Envío de recordatorios y alertas | Número de teléfono, nombre, información de vencimientos |

Todos los proveedores actúan bajo instrucciones de Explo y están sujetos a acuerdos de encargo de tratamiento que garantizan niveles de protección equivalentes a los exigidos por la legislación chilena.

### 8.2 Requerimiento de autoridades

Explo podrá comunicar datos personales cuando sea requerido por mandato legal, resolución judicial o solicitud legítima de la **Agencia de Protección de Datos Personales (APDP)** u otras autoridades competentes del Estado de Chile.

---

## 9. Transferencias Internacionales de Datos

El almacenamiento de documentos en **AWS S3** puede implicar el tratamiento de datos en servidores ubicados fuera de Chile. Explo adopta las siguientes salvaguardas:

- Selección de regiones de AWS con legislación equivalente o garantías contractuales adecuadas.
- Incorporación de cláusulas contractuales de protección de datos en los acuerdos con proveedores.
- Evaluación del nivel de protección ofrecido por el país de destino conforme a los criterios establecidos por la Ley N° 21.719 y la APDP.

---

## 10. Derechos del Titular

De conformidad con la **Ley N° 21.719**, toda persona titular de datos personales tratados por Explo tiene derecho a:

| Derecho | Contenido |
|---------|-----------|
| **Acceso** | Conocer qué datos personales suyos son tratados, con qué finalidad, origen y destinatarios. |
| **Rectificación** | Solicitar la corrección de datos inexactos o incompletos. |
| **Supresión ("derecho al olvido")** | Solicitar la eliminación de sus datos cuando hayan dejado de ser necesarios, se retire el consentimiento o el tratamiento sea ilícito. |
| **Oposición** | Oponerse al tratamiento basado en interés legítimo cuando concurran motivos fundados relativos a su situación particular. |
| **Portabilidad** | Recibir sus datos en formato estructurado, de uso común y lectura mecánica, y transmitirlos a otro responsable. |
| **No ser objeto de decisiones automatizadas** | No ser sometido a decisiones basadas únicamente en tratamiento automatizado que produzcan efectos jurídicos significativos. |
| **Revocación del consentimiento** | Retirar en cualquier momento el consentimiento otorgado, sin que ello afecte la licitud del tratamiento previo. |
| **Bloqueo** | Solicitar la suspensión temporal del tratamiento mientras se verifica una solicitud de rectificación u oposición. |

### 10.1 Cómo ejercer los derechos

Para ejercer cualquiera de estos derechos, el titular debe enviar una solicitud escrita al correo de contacto indicado en la sección 16, indicando:

1. Nombre completo y correo electrónico asociado a la cuenta.
2. Derecho que desea ejercer y descripción de su solicitud.
3. Copia de cédula de identidad u otro documento que acredite su identidad.

Explo responderá dentro de los plazos establecidos por la Ley N° 21.719 (generalmente 30 días hábiles, prorrogables por una vez en casos complejos).

### 10.2 Reclamación ante la APDP

Si el titular considera que sus derechos no han sido atendidos satisfactoriamente, podrá presentar una reclamación ante la **Agencia de Protección de Datos Personales (APDP)**, organismo autónomo creado por la Ley N° 21.719 con competencia para fiscalizar el cumplimiento de la normativa de protección de datos en Chile.

---

## 11. Medidas de Seguridad

Explo implementa medidas técnicas y organizativas apropiadas para proteger los datos personales frente a accesos no autorizados, pérdida, destrucción o divulgación indebida:

### 11.1 Medidas técnicas

- **Autenticación robusta:** doble factor de autenticación (2FA) por correo electrónico para todos los usuarios.
- **Cifrado en tránsito:** comunicaciones protegidas mediante TLS/HTTPS.
- **Tokens de corta duración:** uso de JWT con expiración controlada para sesiones de usuario.
- **Control de acceso basado en roles (RBAC):** cada usuario accede únicamente a los recursos correspondientes a su rol.
- **Guards de autenticación en WebSocket:** el canal de notificaciones en tiempo real valida el JWT antes de establecer la conexión.
- **Almacenamiento seguro de archivos:** documentos e imágenes almacenados en AWS S3 con políticas de acceso restringidas.
- **Schedulers de detección de anomalías:** monitoreo automático diario del estado de los datos para alertas operativas.

### 11.2 Medidas organizativas

- Acceso a datos restringido al personal y sistemas estrictamente necesarios para la prestación del servicio.
- Variables de entorno sensibles (credenciales de BD, Keycloak, AWS, WhatsApp) gestionadas fuera del control de versiones.
- Plan de respuesta ante incidentes de seguridad.

### 11.3 Notificación de brechas de seguridad

En caso de producirse una brecha de seguridad que afecte datos personales, Explo notificará a la **APDP** y, cuando corresponda, a los titulares afectados, en los plazos establecidos por la Ley N° 21.719, con descripción de la naturaleza de la brecha, datos afectados, consecuencias probables y medidas adoptadas.

---

## 12. Cookies, Almacenamiento Local y Sesiones

La Plataforma utiliza los siguientes mecanismos de almacenamiento en el navegador del usuario:

| Mecanismo | Uso | Duración |
|-----------|-----|----------|
| **localStorage** (clave `explo_auth`) | Almacenamiento del token JWT de sesión mediante Zustand persist | Hasta cierre de sesión o expiración del token |
| **sessionStorage** | Estado temporal de navegación (no persiste entre reinicios del navegador) | Sesión del navegador |
| **Cookies de sesión** | Pueden ser utilizadas por el proveedor de identidad Keycloak para gestión de autenticación | Según configuración de Keycloak |

La Plataforma **no utiliza cookies de rastreo de terceros** ni cookies con fines publicitarios. El usuario puede gestionar las preferencias de almacenamiento de su navegador, aunque ello puede afectar el correcto funcionamiento de la sesión.

---

## 13. Notificaciones y Comunicaciones

### 13.1 Notificaciones en plataforma

La Plataforma envía notificaciones en tiempo real a través de WebSocket sobre eventos relevantes del portafolio del usuario (tareas, contratos, pagos, alertas). Estas notificaciones son parte esencial del servicio y no pueden desactivarse sin afectar la funcionalidad principal.

### 13.2 Notificaciones por WhatsApp

Explo puede enviar mensajes por WhatsApp a los números de teléfono registrados en la plataforma (usuarios, propietarios y arrendatarios), con el propósito de enviar recordatorios de vencimientos, alertas de pago y avisos de contratos. El envío a terceros (propietarios y arrendatarios) se realiza por instrucción del usuario, quien es responsable de contar con el consentimiento correspondiente de dichas personas.

Para cesar el envío de comunicaciones por WhatsApp, el titular puede solicitarlo conforme al procedimiento de ejercicio de derechos descrito en la sección 10.

---

## 14. Términos de Uso de la Plataforma

### 14.1 Acceso y registro

El acceso a Explo requiere el registro de una cuenta con datos verídicos y la aceptación de estos Términos de Uso. El usuario es responsable de mantener la confidencialidad de sus credenciales. Explo no se responsabiliza por accesos no autorizados derivados de negligencia del usuario en la custodia de sus credenciales.

### 14.2 Uso permitido

El usuario se compromete a utilizar la Plataforma exclusivamente para la gestión profesional de propiedades en arriendo conforme a la legislación chilena vigente. Queda expresamente prohibido:

- Ingresar datos falsos, incompletos o de personas sin su consentimiento, cuando éste sea requerido.
- Utilizar la Plataforma para actividades ilícitas, fraudulentas o que vulneren derechos de terceros.
- Intentar acceder a datos de otros usuarios o realizar ataques contra la infraestructura del sistema.
- Compartir credenciales de acceso con terceros no autorizados.
- Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de la Plataforma.

### 14.3 Responsabilidad del usuario sobre datos de terceros

El usuario que ingresa datos personales de propietarios, arrendatarios u otras personas a la Plataforma asume la calidad de **responsable de tratamiento** respecto de esos datos en su relación con los titulares. En consecuencia:

- Debe contar con base de legitimidad adecuada (consentimiento, relación contractual, etc.) para el ingreso y tratamiento de dichos datos.
- Debe informar a los titulares sobre el tratamiento de sus datos conforme a la Ley N° 21.719.
- Es responsable de la exactitud y actualización de los datos ingresados.
- Explo actúa como encargado de tratamiento respecto de esos datos y no asume responsabilidad por incumplimientos del usuario en esta materia.

### 14.4 Disponibilidad del servicio

Explo procurará la máxima disponibilidad de la Plataforma, pero no garantiza un servicio ininterrumpido. Podrán producirse interrupciones por mantenimiento, actualizaciones o circunstancias ajenas al control del Responsable. Explo no será responsable por daños derivados de interrupciones del servicio salvo dolo o culpa grave.

### 14.5 Propiedad intelectual

Todo el software, diseño, interfaces, logotipos y contenidos de la Plataforma son propiedad de Explo o sus licenciantes. El usuario obtiene una licencia de uso personal, no exclusiva, intransferible y revocable para acceder a la Plataforma durante la vigencia del contrato de servicio. Ningún contenido de la Plataforma puede ser reproducido, distribuido o modificado sin autorización expresa.

### 14.6 Contenidos y documentos del usuario

Los documentos, imágenes y datos ingresados por el usuario a la Plataforma son de su exclusiva propiedad. Explo no adquiere ningún derecho sobre dichos contenidos más allá del tratamiento necesario para la prestación del servicio. El usuario garantiza que cuenta con los derechos necesarios sobre los contenidos que sube y que éstos no infringen derechos de terceros.

### 14.7 Suspensión y terminación

Explo se reserva el derecho de suspender o cancelar el acceso de un usuario que infrinja estos Términos de Uso, sin perjuicio del ejercicio de las acciones legales que correspondan. El usuario podrá solicitar la cancelación de su cuenta en cualquier momento, lo que conllevará la supresión de sus datos conforme a lo establecido en la sección 7.

### 14.8 Legislación aplicable y jurisdicción

Estos Términos de Uso se rigen por la legislación de la República de Chile. Para la resolución de disputas que no puedan solucionarse de forma amistosa, las partes se someten a la jurisdicción de los Tribunales Ordinarios de Justicia de la ciudad de Santiago de Chile, con renuncia expresa a cualquier otro fuero.

---

## 15. Modificaciones a estas Políticas

Explo podrá modificar estas Políticas de Privacidad y Términos de Uso cuando sea necesario para reflejar cambios normativos, tecnológicos o en los servicios ofrecidos. Las modificaciones serán comunicadas mediante:

- Notificación en la Plataforma con al menos 15 días de anticipación a su entrada en vigencia.
- Envío de aviso al correo electrónico registrado por el usuario.

El uso continuado de la Plataforma tras la comunicación de los cambios implicará la aceptación de las nuevas condiciones. Si el usuario no acepta las modificaciones, deberá cesar el uso de la Plataforma y podrá solicitar la eliminación de su cuenta.

---

## 16. Contacto y Ejercicio de Derechos

Para ejercer derechos sobre datos personales, reportar incidentes de seguridad, solicitar información o formular consultas sobre estas Políticas, puede contactarnos a través de:

**Correo electrónico:** [correo-de-contacto@explo.cl]  
**Formulario de contacto:** disponible en la Plataforma en la sección de soporte.

Las solicitudes de ejercicio de derechos serán atendidas en los plazos establecidos por la **Ley N° 21.719**, contados desde la recepción de la solicitud completa.

Si no recibe respuesta satisfactoria, puede acudir a la:

**Agencia de Protección de Datos Personales (APDP)**  
Organismo autónomo creado por la Ley N° 21.719  
Web: [www.apdp.cl]

---

*Este documento ha sido elaborado de conformidad con la Ley N° 21.719 sobre Protección de Datos Personales, la Ley N° 19.628 sobre Protección de la Vida Privada y demás normativa aplicable vigente en Chile al momento de su redacción.*
