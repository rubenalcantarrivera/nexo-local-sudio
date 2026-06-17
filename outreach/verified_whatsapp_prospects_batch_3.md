# Prospectos WhatsApp verificados - batch 3

Este batch reemplaza los numeros que fallaron en el batch anterior. Para este archivo no se usaron telefonos genericos de directorios ni numeros inferidos: cada prospecto viene de una fuente publica que marca el numero como WhatsApp o muestra un enlace `wa.me`.

Notas importantes:

- No se abrieron chats ni se enviaron mensajes al generar este batch.
- La cola usa el link general de ejemplos: `https://nexo-local-studio-public.vercel.app/demos`.
- El mensaje no incluye demos individuales por nicho.
- Se conservaron los prefijos publicados por la fuente (`52` o `521`) para evitar romper enlaces de WhatsApp que ya venian publicados asi.
- El script solo abre chats con mensaje prellenado. La revision y el envio siguen siendo manuales.

## Archivos

- `outreach/verified_whatsapp_prospects_batch_3.csv`: prospectos y evidencia publica.
- `outreach/whatsapp_verified_channels_batch_3.csv`: canales marcados como `exists_on_whatsapp` por evidencia publica.
- `outreach/whatsapp_outreach_queue_batch_3.csv`: cola lista para revision manual.

## Comando para abrir desde terminal

Desde la raiz del proyecto:

```bash
cd /Users/rubenalcantar/Downloads/nexo-local-studio
./outreach/scripts/open_batch_3_whatsapp.sh 10
```

El numero `10` abre los primeros 10 chats listos. Puedes usar `5`, `10` o maximo `20`.

El script pide confirmacion antes de abrir. No manda mensajes automaticamente.

## Mensaje usado

```text
Hola, vi que su negocio tiene presencia en Google Maps y reputacion local.

Somos Nexo Local Studio. Hacemos paginas web rapidas y profesionales para negocios locales, conectadas a WhatsApp, ubicacion y formularios.

Pueden ver los ejemplos de Nexo Local Studio aqui:
https://nexo-local-studio-public.vercel.app/demos

Precios desde $2,500 MXN.

Si les interesa, podemos enviarles una propuesta breve. Si no les interesa recibir mas mensajes, digannos baja.
```

## Validacion del batch

- Prospectos: 30
- Filas `ready_to_review`: 30
- Filas con `exists_on_whatsapp`: 30
- URLs con encoding valido: 30
- Errores de encoding: 0
- Mensajes con `/demos/` individual: 0
- Mensajes con galeria `/demos`: 30
- Numero de Nexo usado como destinatario: 0
- Largo maximo del mensaje: 457 caracteres

## Prospectos

| # | Negocio | Nicho | Ciudad | WhatsApp | Evidencia publica |
|---:|---|---|---|---|---|
| 1 | Clinica La Central Dental | Dental | Merida | `529993886240` | Fuente publica indica WhatsApp e incluye `https://wa.me/529993886240`. |
| 2 | Dental Corona Las Torres | Dental | Ciudad Juarez | `5216567547325` | Fuente publica indica agenda por WhatsApp: `https://wa.me/5216567547325`. |
| 3 | Rayos X Dentales | Dental | Saltillo | `528442711587` | Fuente publica indica apartar cita por WhatsApp: `http://wa.me/528442711587`. |
| 4 | Dental Sonora TJ | Dental | Tijuana | `5216643106030` | Fuente publica indica `664 310 6030` como WhatsApp. |
| 5 | DentaLis | Dental | Queretaro | `5214424064588` | Fuente publica indica agenda por WhatsApp `4424064588`. |
| 6 | Del Sol Grupo Dental | Dental | Ciudad Juarez | `5216562436992` | Fuente publica indica WhatsApp `656-2436992`. |
| 7 | My Clinic Dental | Dental | Hermosillo | `5216621389097` | Fuente publica indica WhatsApp `6621 38 9097`. |
| 8 | AR Clinica Dental | Dental | Pachuca | `5215566945460` | Fuente publica indica citas e informes via WhatsApp `5566945460`. |
| 9 | Clinica Dental Celaya | Dental | Celaya | `5214611824051` | Fuente publica indica agenda al WhatsApp `4611824051`. |
| 10 | Dental Harmonia | Dental | CDMX | `5215525638888` | Fuente publica indica agenda via WhatsApp `55 2563 8888`. |
| 11 | BioConcept | Dental | Monterrey | `5218120120369` | Fuente publica indica valoracion via WhatsApp `+52 81 2012 0369`. |
| 12 | Dental group Dr.Wong | Dental | Mexicali | `5216865556210` | Fuente publica indica agenda por WhatsApp `686 555 6210`. |
| 13 | Clinica Vazquez | Clinica estetica | Agua Prieta | `5216624297105` | Fuente publica indica WhatsApp `662 429 7105`. |
| 14 | Clinica Medica El Rosario | Clinica medica | CDMX | `5215573504496` | Fuente publica indica agenda por WhatsApp `+52 55 7350 4496`. |
| 15 | Life Grupo Medico | Clinica medica | Mexicali | `5216862761708` | Fuente publica indica atencion via WhatsApp `686-276-1708`. |
| 16 | UREUS Clinic Oficial | Clinica medica | CDMX | `5215580030570` | Fuente publica indica WhatsApp `+52 55 8003 0570`. |
| 17 | Human | Clinica medica | Minatitlan | `5219221867607` | Fuente publica indica WhatsApp `922 186 7607`. |
| 18 | CIMO Hospital | Clinica medica | Ciudad Valles | `5214811127885` | Fuente publica indica WhatsApp `481 112 7885`. |
| 19 | Clinica Lancet | Clinica medica | Reynosa | `5218997543466` | Fuente publica indica agenda por WhatsApp `8997543466`. |
| 20 | Smart Fisio Mor | Fisioterapia | Cuernavaca | `5217774224548` | Fuente publica indica WhatsApp `777 422 45 48`. |
| 21 | MiPhysio | Fisioterapia | CDMX | `5215532817346` | Fuente publica indica WhatsApp `55 3281 7346`. |
| 22 | FyK Sport | Fisioterapia | Guadalajara | `5213323016638` | Fuente publica indica contacto por WhatsApp `3323016638`. |
| 23 | Nutriologa Selma Chavez | Nutricion | Huauchinango | `5217761535841` | Fuente publica indica WhatsApp `776 153 5841`. |
| 24 | Animal Care | Veterinaria | Nogales | `5216313028314` | Fuente publica indica WhatsApp `631 302 8314`. |
| 25 | Diwali Clinica Veterinaria | Veterinaria | Santa Catarina | `5218131763917` | Fuente publica indica agenda por WhatsApp `81 3176 3917`. |
| 26 | Reino Animal Puebla | Veterinaria | Puebla | `5212222517057` | Fuente publica indica WhatsApp `222 251 7057`. |
| 27 | La Casa Vieja Zihuatanejo | Restaurante boutique | Zihuatanejo | `527551131533` | Fuente publica indica WhatsApp `https://wa.me/527551131533`. |
| 28 | Restaurante El Muelle | Restaurante boutique | Tepotzotlan | `5215612768717` | Fuente publica indica reserva por WhatsApp `https://wa.me/5215612768717`. |
| 29 | Restaurante La Playita | Restaurante boutique | Monterrey | `528125671544` | Fuente publica indica WhatsApp `wa.me/528125671544`. |
| 30 | Octo Restaurante | Restaurante boutique | Guadalajara | `5213323393908` | Fuente publica indica reserva al WhatsApp `33 2339 3908`. |

