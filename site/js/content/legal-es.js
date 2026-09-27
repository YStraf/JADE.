// Documentos legales — traducción al español (la versión francesa es la que da fe).
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = TODO('nombre del editor o razón social');
const MAIL = TODO('dirección de correo de contacto');
export default [
  { id: 'mentions', title: 'Aviso legal', updated: '2026-09-27', html: `
<p>De conformidad con el artículo 6 III de la ley francesa n.º 2004-575, de 21 de junio de 2004, para la confianza en la economía digital (LCEN), esta es la información sobre el editor y el alojador del sitio Jade.</p>
<h3>Editor</h3>
<p>El sitio Jade está editado por ${EDITOR}, ${TODO('forma jurídica (empresario individual, SAS…)')}, ${TODO('capital social si procede')}, con domicilio social en ${TODO('dirección postal')}.</p>
<ul><li>Inscripción: ${TODO('RCS / RNE y número SIREN')}</li><li>Número de IVA intracomunitario: ${TODO('si procede')}</li><li>Contacto: ${MAIL} — ${TODO('número de teléfono')}</li></ul>
<p>Si el editor es un particular que actúa a título no profesional, puede, conforme al artículo 6 III 2 de la LCEN, hacer público únicamente el nombre del alojador, siempre que le haya comunicado sus datos de identificación.</p>
<h3>Director de la publicación</h3>
<p>${TODO('nombre del director de la publicación')}.</p>
<h3>Alojamiento</h3>
<p>El sitio está alojado por Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Estados Unidos — vercel.com. Cuando se abran las cuentas en línea, los datos de las cuentas se almacenarán en ${TODO('nombre del proveedor de base de datos')}, dentro de la Unión Europea.</p>
<h3>Propiedad intelectual</h3>
<p>Los textos, rutinas, ilustraciones, emblemas, elementos gráficos y el código de Jade están protegidos por el Código de la Propiedad Intelectual francés y pertenecen al editor salvo indicación en contrario. Queda prohibida cualquier reproducción o reutilización sin autorización.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam y Discord son marcas de sus respectivos titulares. Jade es un sitio independiente sin vínculo oficial con Valve, Riot Games, Kovaak's, Statespace, FACEIT ni Discord. Los nombres de los escenarios de entrenamiento se citan a título informativo para poder encontrarlos en el software correspondiente.</p>
<h3>Denunciar un contenido</h3>
<p>Consulta el documento «Denunciar contenido». Contacto: ${MAIL}.</p>` },

  { id: 'cgu', title: 'Condiciones generales de uso', updated: '2026-09-27', html: `
<h3>1. Objeto</h3>
<p>Estas condiciones generales de uso regulan el acceso y el uso del sitio Jade, que ofrece rutinas de entrenamiento de puntería, tests, un sistema de niveles, rangos y recompensas cosméticas, herramientas de optimización, seguimiento del progreso, desafíos y un espacio comunitario. Usar el sitio implica aceptar estas condiciones.</p>
<h3>2. Acceso al servicio</h3>
<p>El acceso básico es gratuito. Requiere un equipo y una conexión a internet a cargo del usuario. El editor se esfuerza por mantener el sitio disponible, pero puede interrumpirlo por mantenimiento o por motivos técnicos, sin indemnización.</p>
<h3>3. Cuenta</h3>
<ul><li>La creación de una cuenta está reservada a personas de al menos 15 años. Conforme al artículo 45 de la ley francesa de Informática y Libertades, un menor de 15 años no puede consentir solo el tratamiento de sus datos.</li><li>Una cuenta por persona. La información proporcionada debe ser exacta.</li><li>Eres responsable de la confidencialidad de tu contraseña y de la actividad de tu cuenta. Avísanos de inmediato de cualquier uso no autorizado.</li><li>Versión actual: las cuentas se guardan localmente en tu navegador. Aún no se sincronizan con un servidor.</li></ul>
<h3>4. Reglas de la comunidad</h3>
<p>El uso de los espacios comunitarios (foro, perfiles, desafíos) está sujeto a las <a href="#/legal/community">Normas de la comunidad y de moderación</a>, que forman parte integrante de estas condiciones.</p>
<h3>5. Contenidos de los usuarios</h3>
<p>Conservas los derechos sobre los contenidos que publicas. Concedes al editor, mientras estén en línea, una licencia gratuita, no exclusiva y mundial para alojarlos, reproducirlos y mostrarlos en Jade, únicamente para el funcionamiento del servicio. Garantizas que dispones de los derechos necesarios sobre esos contenidos (textos, imágenes, vídeos).</p>
<h3>6. Moderación</h3>
<p>De conformidad con el Reglamento (UE) 2022/2065 de servicios digitales (DSA), las reglas, los medios y los procedimientos de moderación se describen en las Normas de la comunidad. Toda decisión de restricción (retirada, ocultación, suspensión) se motiva y puede impugnarse.</p>
<h3>7. Jade Coins, cajas y Arcade</h3>
<p>Las Jade Coins son una moneda virtual gratuita sin valor monetario, regulada por el <a href="#/legal/coins">Reglamento de Jade Coins, Tienda y Arcade</a>.</p>
<h3>8. Desafíos</h3>
<p>Los desafíos semanales se rigen por el <a href="#/legal/challenges">Reglamento de los desafíos</a>.</p>
<h3>9. Responsabilidad</h3>
<p>Los consejos de entrenamiento y optimización se ofrecen a título informativo. Sigues siendo responsable de los ajustes que apliques a tu equipo y a tu sistema. Jade no garantiza ningún resultado de progreso. Entrena a tu ritmo y haz pausas: si te duelen las muñecas o los antebrazos, para y consulta a un profesional de la salud.</p>
<h3>10. Suspensión y cancelación</h3>
<p>Puedes eliminar tu cuenta en cualquier momento desde la pestaña Datos de tu perfil. El editor puede suspender o cerrar una cuenta en caso de incumplimiento grave o reiterado de estas condiciones, mediante decisión motivada, salvo urgencia u obligación legal.</p>
<h3>11. Modificación de las condiciones</h3>
<p>Estas condiciones pueden cambiar. Cualquier cambio importante se anuncia en el sitio antes de su entrada en vigor. Seguir usando el sitio después de esa fecha implica aceptarlo.</p>
<h3>12. Ley aplicable y litigios</h3>
<p>Estas condiciones se rigen por el derecho francés. En caso de litigio, se busca primero una solución amistosa (contacto: ${MAIL}). Si eres consumidor, puedes recurrir gratuitamente al mediador de consumo indicado en las Condiciones de venta. En su defecto, son competentes los tribunales franceses, sin perjuicio de las normas protectoras aplicables a los consumidores.</p>` },

  { id: 'cgv', title: 'Condiciones generales de venta', updated: '2026-09-27', html: `
<p><strong>Importante: los pagos aún no están activos.</strong> Estas condiciones se aplicarán cuando se abran las ofertas de pago. Regulan las ventas entre el editor y un consumidor.</p>
<h3>1. Ofertas</h3>
<ul><li><strong>Gratis</strong>: acceso básico, sin límite de tiempo.</li><li><strong>Programa</strong>: programa de entrenamiento de 8 semanas, pago único, acceso de por vida al contenido comprado.</li><li><strong>Premium</strong>: suscripción mensual sin permanencia.</li></ul>
<p>Las características esenciales de cada oferta se presentan en la página Planes, de conformidad con el artículo L111-1 del Código de Consumo francés.</p>
<h3>2. Precios</h3>
<p>Los precios se indican en euros, impuestos incluidos (artículo L112-1 del Código de Consumo). Ninguna suscripción ni compra da Jade Coins.</p>
<h3>3. Pedido</h3>
<p>Antes de confirmar, ves un resumen de tu pedido y su precio total. El botón de confirmación indica «Pedido con obligación de pago» o una fórmula equivalente (artículo L221-14). Se te envía una confirmación por correo en un soporte duradero.</p>
<h3>4. Pago</h3>
<p>El pago lo gestiona ${TODO('nombre del proveedor de pago autorizado')}. Jade nunca tiene acceso a los datos de tu tarjeta.</p>
<h3>5. Duración, renovación y cancelación de la suscripción</h3>
<ul><li>La suscripción Premium es mensual y se renueva automáticamente.</li><li>Puedes cancelarla en cualquier momento, en línea, mediante la función de cancelación disponible en la pestaña Suscripción de tu perfil (artículo L215-1-1 del Código de Consumo, «cancelación en tres clics»). Se te envía un acuse de recibo.</li><li>La cancelación surte efecto al final del periodo ya pagado.</li></ul>
<h3>6. Derecho de desistimiento</h3>
<p>Dispones de 14 días desde la celebración del contrato para desistir, sin necesidad de justificarlo (artículo L221-18). Para ello, escribe a ${MAIL} o utiliza el formulario tipo de desistimiento.</p>
<p>Excepciones: para un contenido digital no suministrado en soporte material (Programa), el derecho de desistimiento ya no puede ejercerse una vez iniciada la ejecución con tu consentimiento previo y expreso y tu renuncia expresa a este derecho (artículo L221-28, 13.º). Para un servicio (Premium) cuya ejecución solicitas antes del final del plazo, debes un importe proporcional al servicio prestado hasta tu desistimiento (artículo L221-25).</p>
<h3>7. Garantía legal de conformidad</h3>
<p>Los contenidos y servicios digitales se benefician de la garantía legal de conformidad de los artículos L224-25-12 y siguientes del Código de Consumo: puesta en conformidad o, en su defecto, reducción del precio o resolución del contrato. Para un suministro continuo (suscripción), la garantía cubre todo el periodo de suministro; para un suministro único (Programa), los defectos que aparezcan en un plazo de dos años.</p>
<h3>8. Atención al cliente</h3>
<p>${MAIL}. Respuesta en 48 horas laborables de media.</p>
<h3>9. Mediación de consumo</h3>
<p>De conformidad con el artículo L612-1 del Código de Consumo, si un litigio no se resuelve con el servicio de atención al cliente, puedes recurrir gratuitamente al mediador de consumo: ${TODO('nombre, sitio web y dirección del mediador')}.</p>
<h3>10. Ley aplicable</h3>
<p>Estas condiciones se rigen por el derecho francés, sin perjuicio de las disposiciones más protectoras de tu país de residencia.</p>` },

  { id: 'privacy', title: 'Política de privacidad', updated: '2026-09-27', html: `
<p>Esta política explica qué datos trata Jade, para qué y cuáles son tus derechos, de conformidad con el Reglamento (UE) 2016/679 (RGPD) y la ley francesa n.º 78-17, de 6 de enero de 1978 (Informática y Libertades).</p>
<h3>Responsable del tratamiento</h3>
<p>${EDITOR}, contactable en ${MAIL}. ${TODO('Datos del delegado de protección de datos, si se ha designado')}.</p>
<h3>Situación actual</h3>
<p>En su versión actual, Jade funciona sin servidor de cuentas: tu cuenta, tu progreso, tus Jade Coins, tu inventario y tus sesiones se guardan <strong>únicamente en el almacenamiento local de tu navegador</strong>. El editor no tiene acceso a ellos. Los puntos siguientes describen también el funcionamiento previsto cuando se abran las cuentas en línea; esta política se actualizará entonces.</p>
<h3>Datos tratados, finalidades y bases legales</h3>
<ul>
<li><strong>Cuenta</strong> (nombre de usuario, correo, contraseña cifrada, fecha de nacimiento): crear y proteger tu cuenta, comprobar la edad mínima. Base: ejecución del contrato (condiciones de uso) y obligación legal en cuanto a la edad.</li>
<li><strong>Entrenamiento</strong> (puntuaciones, sesiones importadas, récords, XP, rango, Jade Coins, inventario): prestar el servicio. Base: ejecución del contrato.</li>
<li><strong>Perfil público y foro</strong> (nombre de usuario, avatar, banner, mensajes): hacer funcionar la comunidad. Base: ejecución del contrato. Esta información es visible para los demás usuarios según tus ajustes.</li>
<li><strong>Moderación y seguridad</strong> (denuncias, sanciones, registros técnicos): proteger a los usuarios y cumplir nuestras obligaciones. Base: interés legítimo y obligaciones legales (incluida la conservación de los datos de conexión exigida por la LCEN y su decreto de aplicación).</li>
<li><strong>Soporte</strong> (mensajes): responder a tus solicitudes. Base: ejecución del contrato.</li>
<li><strong>Correos informativos</strong> (resumen, recordatorio del desafío): solo si los activas. Base: consentimiento, que puedes retirar en cualquier momento.</li>
<li><strong>Medición de audiencia</strong>: desactivada por defecto, solo con tu consentimiento (ver la política de cookies).</li>
</ul>
<h3>Destinatarios</h3>
<p>Los datos están destinados al editor y a sus encargados técnicos: alojamiento del sitio (Vercel Inc.) y, cuando las cuentas estén en línea, ${TODO('proveedor de base de datos y de correo')}. Las fuentes tipográficas del sitio están alojadas en el propio sitio: no se envía ninguna solicitud a un servicio de fuentes externo. Ningún dato se vende ni se usa con fines publicitarios.</p>
<h3>Transferencias fuera de la Unión Europea</h3>
<p>El alojador del sitio está establecido en Estados Unidos. Las posibles transferencias están cubiertas por el Marco de Privacidad de Datos UE–EE. UU. o por las cláusulas contractuales tipo de la Comisión Europea.</p>
<h3>Plazos de conservación</h3>
<ul><li>Datos de la cuenta y de entrenamiento: mientras exista la cuenta y luego se eliminan en un plazo de 30 días.</li><li>Mensajes del foro: se eliminan o anonimizan al eliminar la cuenta.</li><li>Datos de conexión: 1 año (obligación legal).</li><li>Mensajes de soporte: 3 años después del último intercambio.</li><li>Elecciones sobre cookies: 6 meses.</li></ul>
<h3>Decisiones automatizadas</h3>
<p>El nivel, el rango y las insignias se calculan automáticamente a partir de tus resultados. Este cálculo no produce ningún efecto jurídico ni consecuencia significativa en el sentido del artículo 22 del RGPD.</p>
<h3>Menores</h3>
<p>El sitio está abierto a partir de los 15 años. Conforme al artículo 45 de la ley francesa de Informática y Libertades, un menor de 15 años solo puede registrarse con el consentimiento conjunto de un titular de la patria potestad; como este procedimiento no existe, se rechaza el registro. El Arcade está reservado a mayores de edad.</p>
<h3>Tus derechos</h3>
<p>Tienes derecho de acceso, rectificación, supresión, limitación, portabilidad y oposición, así como derecho a definir instrucciones sobre tus datos tras tu fallecimiento (artículo 85 de la ley francesa de Informática y Libertades). La mayoría pueden ejercerse directamente desde la pestaña Datos de tu perfil (exportación y eliminación). Para lo demás, escribe a ${MAIL}. Puedes presentar una reclamación ante la CNIL (www.cnil.fr) o ante tu autoridad de control local.</p>
<h3>Seguridad</h3>
<p>Las contraseñas se cifran mediante hash (huella criptográfica) y nunca se guardan en texto plano. Los intercambios con el sitio están cifrados (HTTPS).</p>` },

  { id: 'cookies', title: 'Política de cookies y rastreadores', updated: '2026-09-27', html: `
<p>De conformidad con el artículo 82 de la ley francesa de Informática y Libertades y con las directrices y recomendaciones de la CNIL, Jade te informa de los rastreadores utilizados y te permite elegir.</p>
<h3>¿Qué es un rastreador?</h3>
<p>Una cookie o cualquier otro rastreador (por ejemplo, el almacenamiento local del navegador) guarda información en tu dispositivo. Las mismas reglas se aplican sea cual sea la técnica.</p>
<h3>Rastreadores estrictamente necesarios (sin consentimiento)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code>: tus preferencias de visualización.</li><li><code>jade:accounts</code>, <code>jade:current</code>: tu cuenta local y tu sesión.</li><li><code>jade:u:…</code>: tu progreso, tus Jade Coins, tu inventario, tus sesiones.</li><li><code>jade:cookies</code>: tu elección sobre los rastreadores.</li><li>Almacenamiento de sesión: intro ya vista, sesión de administración.</li></ul>
<p>Estos rastreadores sirven únicamente para prestar el servicio que solicitas. No salen de tu dispositivo.</p>
<h3>Medición de audiencia (con consentimiento)</h3>
<p>Por ahora no hay ninguna herramienta de medición de audiencia activa. Si se añade una, solo se activará tras tu consentimiento y se usará únicamente para saber qué páginas son útiles, sin identificar a nadie.</p>
<h3>Publicidad</h3>
<p>Ninguna. Jade no utiliza ningún rastreador publicitario ni ninguna red social de terceros.</p>
<h3>Contenidos de terceros</h3>
<p>Los vídeos de YouTube integrados en el foro se cargan a través de youtube-nocookie.com (modo de privacidad mejorada). Las fuentes tipográficas están alojadas en el sitio: no se contacta con ningún servicio de terceros para mostrarlas.</p>
<h3>Duración</h3>
<p>Tu elección se conserva 6 meses y luego se te vuelve a preguntar. Los rastreadores sujetos a consentimiento tienen una vida útil máxima de 13 meses.</p>
<h3>Cambiar de opinión</h3>
<p>El enlace «Preferencias de cookies», al pie de cada página, vuelve a abrir el banner. Rechazar es tan fácil como aceptar. También puedes borrar el almacenamiento de tu navegador o borrarlo todo desde la pestaña Datos de tu perfil.</p>` },

  { id: 'community', title: 'Normas de la comunidad y de moderación', updated: '2026-09-27', html: `
<p>Estas normas forman parte de las condiciones de uso. Describen lo que está permitido en Jade y cómo funciona la moderación, de conformidad con el Reglamento (UE) 2022/2065 de servicios digitales (DSA) y la LCEN.</p>
<h3>Lo que está prohibido</h3>
<ul><li>Todo contenido ilícito: odio, discriminación, acoso, amenazas, apología del terrorismo o de crímenes, material de abuso sexual infantil, atentado contra la intimidad, difamación, falsificación.</li><li>Trampas: promocionar, enlazar o compartir software de trampas, scripts o cuentas «boosteadas».</li><li>Estafas: phishing, falsos sorteos, falsos sitios de skins o de torneos, solicitudes de credenciales o códigos.</li><li>Venta de cuentas, boosting de pago, compartir credenciales (prohibido por los editores de los juegos).</li><li>Datos personales de terceros, suplantación de identidad.</li><li>Spam, publicidad no solicitada, contenido sexual o violento.</li></ul>
<h3>Denunciar</h3>
<p>Cada mensaje tiene un botón «Denunciar». También puedes usar el procedimiento descrito en «Denunciar contenido». Las denuncias se tratan con diligencia, de forma no arbitraria y objetiva.</p>
<h3>Medios de moderación</h3>
<p>La moderación la llevan a cabo personas (moderadores y administradores). Algunas herramientas automáticas pueden ocultar temporalmente un contenido muy denunciado a la espera de una revisión humana; ninguna sanción definitiva se toma sin intervención humana.</p>
<h3>Decisiones y sanciones</h3>
<ul><li>Según la gravedad: advertencia, ocultación o retirada del contenido, suspensión temporal, cierre de la cuenta.</li><li>Cada decisión se motiva: hechos, norma aplicada, vías de recurso (artículo 17 DSA).</li><li>Los contenidos manifiestamente ilícitos se retiran con rapidez. Las infracciones graves pueden comunicarse a las autoridades (plataforma PHAROS en Francia), y cualquier amenaza para la vida o la seguridad de una persona se notifica a las autoridades competentes (artículo 18 DSA).</li></ul>
<h3>Reclamaciones</h3>
<p>Puedes impugnar una decisión que te afecte en un plazo de 6 meses, de forma gratuita, escribiendo a ${MAIL}. La reclamación la revisa una persona que no tomó la decisión inicial. También puedes acudir a los tribunales competentes.</p>
<h3>Denuncias abusivas</h3>
<p>Las denuncias manifiestamente infundadas y repetidas pueden conllevar la suspensión temporal de la tramitación de tus denuncias. Presentar a sabiendas un contenido como ilícito para conseguir su retirada puede estar castigado por la ley.</p>` },

  { id: 'challenges', title: 'Reglamento de los desafíos', updated: '2026-09-27', html: `
<h3>1. Organizador</h3>
<p>Los desafíos semanales los organiza ${EDITOR}.</p>
<h3>2. Participación</h3>
<p>La participación es gratuita, sin obligación de compra, y abierta a cualquier persona con una cuenta de Jade. Ser suscriptor no da ninguna ventaja en la clasificación principal de los desafíos. Los desafíos se basan exclusivamente en la habilidad de los participantes, sin ningún elemento de azar.</p>
<h3>3. Funcionamiento</h3>
<p>Cada desafío versa sobre un escenario anunciado, del lunes a las 00:00 al domingo a las 23:59 (hora de París). Solo cuenta la mejor puntuación de cada participante en el periodo.</p>
<h3>4. Validación</h3>
<ul><li>La puntuación debe lograrse en el escenario exacto anunciado, sin modificación del juego ni software de terceros.</li><li>Los tres primeros deben aportar el vídeo completo de su mejor sesión para validar su puesto.</li><li>Las puntuaciones pueden contrastarse con las clasificaciones oficiales del software de entrenamiento.</li><li>Cualquier intento de falsificación supone la exclusión de los desafíos y la pérdida de las recompensas.</li></ul>
<h3>5. Recompensas</h3>
<p>Cada participante con una puntuación válida recibe XP y Jade Coins según su puesto (300 monedas para el 1.º, 250 para el top 3, 200 para el top 10, 150 para el top 25, 100 para los demás). El posible premio semanal se anuncia en la página Desafíos. No puede cambiarse por su valor en metálico ni cederse. El ganador es contactado por correo en un plazo de siete días y dispone de 30 días para reclamarlo.</p>
<h3>6. Datos</h3>
<p>Los nombres de usuario y las puntuaciones de los participantes aparecen en la clasificación pública. Los datos se tratan conforme a la política de privacidad.</p>
<h3>7. Modificaciones</h3>
<p>Este reglamento puede cambiar; cualquier cambio se anuncia en esta página antes del desafío afectado.</p>` },

  { id: 'coins', title: 'Reglamento de Jade Coins, Tienda y Arcade', updated: '2026-09-27', html: `
<h3>1. Naturaleza de las Jade Coins</h3>
<ul><li>Las Jade Coins son una moneda virtual <strong>gratuita</strong>, utilizable únicamente en Jade.</li><li>Se ganan exclusivamente usando el sitio (sesiones, récords, rachas, hitos de nivel, desafíos).</li><li><strong>No se pueden comprar</strong>, ni directamente ni mediante una suscripción u oferta de pago.</li><li><strong>No tienen ningún valor monetario</strong>: no son reembolsables, ni convertibles en dinero o bienes, ni intercambiables, ni transferibles entre cuentas.</li><li>Constituyen una simple licencia de uso personal y revocable vinculada a la cuenta.</li></ul>
<h3>2. Cajas y objetos cosméticos</h3>
<ul><li>Las cajas se abren únicamente con Jade Coins. Su contenido se sortea al azar; <strong>las probabilidades de cada objeto y de cada rareza se muestran</strong> antes de la apertura.</li><li>Los objetos son puramente cosméticos (banners, marcos, títulos). No dan ninguna ventaja en los tests, los rangos ni los desafíos.</li><li>Los objetos no se pueden ceder, intercambiar ni revender, ni en Jade ni fuera. No son «objetos digitales monetizables».</li><li>El número de aperturas está limitado por día.</li></ul>
<h3>3. Arcade</h3>
<ul><li>El Arcade ofrece minijuegos de entretenimiento (ruleta, cara o cruz, cuadrícula) que usan Jade Coins.</li><li>Al no existir apuesta económica ni ganancia con valor monetario, estos juegos no son juegos de azar con dinero en el sentido del artículo L320-1 del Código de Seguridad Interior francés.</li><li>Por precaución, el Arcade está <strong>reservado a mayores de edad</strong>, limitado a un número de partidas por día, y cada jugador puede excluirse (7 días, 30 días o definitivamente) desde la Tienda.</li><li>El retorno esperado de cada juego es inferior o igual a la apuesta: ninguna estrategia permite «ganar» monedas a largo plazo.</li></ul>
<h3>4. Juego responsable</h3>
<p>Estas mecánicas deben seguir siendo un juego. Si sientes que ya no puedes parar, en los juegos o en otro lugar, habla de ello. En Francia: Joueurs Info Service, 09 74 75 13 13 (tarifa normal, 7 días a la semana).</p>
<h3>5. Modificación y supresión</h3>
<p>El editor puede modificar la escala de recompensas, el contenido de las cajas o los juegos, o ponerles fin, tras informar a los usuarios. Eliminar la cuenta implica perder las Jade Coins y los objetos, sin compensación, ya que no tienen valor monetario.</p>
<h3>6. Abusos</h3>
<p>Cualquier manipulación (modificación de datos, automatización, explotación de un error) puede conllevar el restablecimiento de las Jade Coins y del inventario.</p>` },

  { id: 'accessibility', title: 'Declaración de accesibilidad', updated: '2026-09-27', html: `
<p>El editor se compromete a hacer Jade accesible al mayor número de personas posible, basándose en el referencial francés de accesibilidad (RGAA 4.1) y la norma EN 301 549.</p>
<h3>Estado de conformidad</h3>
<p>El sitio aún no ha sido objeto de una auditoría completa. Se declara <strong>no conforme</strong> a la espera de esta auditoría, lo que significa que la conformidad aún no se ha medido.</p>
<h3>Medidas adoptadas</h3>
<ul><li>Navegación completa con teclado, foco visible, enlace para saltar al contenido.</li><li>Búsqueda global (Ctrl + K) para encontrar cualquier página o contenido.</li><li>Respeto de la preferencia del sistema «reducir el movimiento» y un interruptor de Animaciones en el perfil.</li><li>Temas claro, oscuro y de alto contraste.</li><li>Sonidos desactivados por defecto.</li></ul>
<h3>Contenidos no accesibles conocidos</h3>
<ul><li>Los tests de puntería y algunas pruebas se basan por naturaleza en la precisión y la velocidad del ratón.</li><li>La animación de introducción usa un lienzo decorativo (sin información esencial).</li><li>Los gráficos de progreso aún no tienen una alternativa textual completa.</li></ul>
<h3>Comentarios y contacto</h3>
<p>Si encuentras un problema de accesibilidad que te impide acceder a un contenido o a una función, escribe a ${MAIL}: te proporcionaremos la información de otra forma.</p>
<h3>Vías de recurso</h3>
<p>Si no obtienes una respuesta satisfactoria, puedes acudir al Defensor de los Derechos francés (www.defenseurdesdroits.fr).</p>` },

  { id: 'report', title: 'Denunciar contenido', updated: '2026-09-27', html: `
<p>De conformidad con los artículos 11, 12 y 16 del Reglamento (UE) 2022/2065 (DSA) y la LCEN, así puedes denunciar un contenido que consideres ilícito o contrario a las normas.</p>
<h3>Desde el sitio</h3>
<p>Usa el botón «Denunciar» debajo del mensaje en cuestión, o el formulario de la página Seguridad para una estafa.</p>
<h3>Por correo</h3>
<p>Escribe a ${MAIL} indicando:</p>
<ul><li>la dirección exacta (URL) del contenido;</li><li>una explicación suficientemente fundamentada de por qué lo consideras ilícito;</li><li>tu nombre y tu correo (salvo para material de abuso sexual infantil);</li><li>una declaración que confirme que actúas de buena fe y que la información proporcionada es exacta y completa.</li></ul>
<p>Recibes un acuse de recibo y luego la decisión tomada y sus motivos.</p>
<h3>Punto de contacto único</h3>
<p>Autoridades de los Estados miembros, Comisión Europea y Junta Europea de Servicios Digitales: ${MAIL} (francés o inglés). Usuarios: la misma dirección.</p>
<h3>Otros recursos útiles (Francia)</h3>
<ul><li>Contenidos ilícitos graves: internet-signalement.gouv.fr (PHAROS).</li><li>Ciberacoso: 3018 (llamada, chat o aplicación, gratuito y anónimo).</li><li>Estafa o pirateo: 17cyber.gouv.fr y cybermalveillance.gouv.fr.</li><li>Peligro inmediato: 17 o 112.</li></ul>
<h3>Advertencia</h3>
<p>Según la ley francesa, presentar al alojador un contenido como ilícito para conseguir su retirada sabiendo que esa información es inexacta se castiga con un año de prisión y 15 000 € de multa.</p>` },

  { id: 'sources', title: "Fuentes y créditos", updated: '2026-09-28', html: `
<p>Jade se apoya en el trabajo de la comunidad del aim training. Esta página indica de dónde vienen los contenidos del sitio y a quién pertenecen las marcas citadas.</p>
<h3>Rutinas de entrenamiento</h3>
<p>La elección y el orden de los escenarios, el número de runs y los códigos de playlist de las rutinas proceden de los documentos públicos de <strong>Voltaic</strong>, comunidad de entrenamiento de puntería (voltaic.gg): rutinas fundamentales, por debilidad y por juego, para Kovaak's y Aim Lab. La biblioteca de escenarios sigue su tabla de escenarios recomendados (revisión de 2024 por clover).</p>
<ul><li>Rutina experta de Valorant: bardOZ, para Voltaic.</li><li>Calentamiento RAMP de Valorant: minigodcs, para Voltaic.</li><li>Rutina de switching rápido: Viscose y Christmasiscancelled.</li></ul>
<p>Los títulos, las instrucciones y las traducciones los redacta Jade. Jade no está afiliado a Voltaic ni cuenta con su aprobación. Para cualquier corrección o retirada: ${MAIL}.</p>
<h3>Nombres de escenarios</h3>
<p>Los escenarios pertenecen a sus creadores. Sus nombres se citan tal cual para poder encontrarlos en Kovaak's y Aim Lab.</p>
<h3>Marcas</h3>
<p>Counter-Strike 2 y Steam son marcas de Valve Corporation; Valorant es una marca de Riot Games; Kovaak's pertenece a sus editores; Aim Lab es una marca de Statespace; FACEIT y Discord pertenecen a sus titulares. Jade es un sitio independiente sin vínculo oficial con estas empresas.</p>
<h3>Tipografías y recursos gráficos</h3>
<p>Tipografías Chakra Petch y Manrope, con licencia SIL Open Font License 1.1, alojadas en el sitio. Los emblemas de rango, las imágenes de cajas, los iconos y los cosméticos están creados para Jade.</p>
<h3>Información práctica</h3>
<p>Los ajustes de optimización se basan en las opciones oficiales de Windows, de los controladores NVIDIA y AMD y de los juegos. Los recursos de ayuda a víctimas de la página Seguridad son servicios públicos franceses (17cyber.gouv.fr, cybermalveillance.gouv.fr). Las referencias de tests y rangos las calibra Jade y son provisionales.</p>` },
];
