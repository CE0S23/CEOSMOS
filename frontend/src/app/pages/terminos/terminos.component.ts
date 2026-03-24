import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.scss']
})
export class TerminosComponent {

  lastUpdated = 'Febrero 2026';

  sections = [
    {
      icon: 'gavel',
      title: 'Aceptación de los Términos',
      content: `Al acceder y utilizar CEOSMOS, aceptas quedar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al servicio. Estos términos se aplican a todos los visitantes, usuarios y demás personas que accedan o utilicen el servicio.`
    },
    {
      icon: 'manage_accounts',
      title: 'Uso de la Plataforma',
      content: `CEOSMOS es una plataforma de productividad diseñada para facilitar el estado de flujo y el trabajo profundo. Te comprometes a utilizar el servicio únicamente con fines lícitos y de manera que no infrinja los derechos de otros ni restrinja o inhiba el uso y disfrute del servicio por parte de terceros.`
    },
    {
      icon: 'lock',
      title: 'Privacidad y Datos',
      content: `Tu privacidad es fundamental para nosotros. CEOSMOS no recopila datos personales sin tu consentimiento explícito. Los datos de preferencias y configuración se almacenan localmente en tu dispositivo. No compartimos, vendemos ni alquilamos tu información personal a terceros bajo ninguna circunstancia.`
    },
    {
      icon: 'copyright',
      title: 'Propiedad Intelectual',
      content: `El servicio y su contenido original, características y funcionalidad son y seguirán siendo propiedad exclusiva de CEOSMOS y sus licenciantes. Nuestro servicio está protegido por derechos de autor, marcas registradas y otras leyes de propiedad intelectual. Tus comentarios no pueden usarse comercialmente sin nuestro consentimiento.`
    },
    {
      icon: 'link',
      title: 'Recursos Externos',
      content: `CEOSMOS puede contener enlaces a sitios web o servicios de terceros que no son propiedad ni están controlados por nosotros. No tenemos control sobre el contenido, las políticas de privacidad ni las prácticas de los sitios web de terceros. No asumimos responsabilidad por el contenido, la exactitud ni las opiniones expresadas en dichos sitios.`
    },
    {
      icon: 'warning',
      title: 'Limitación de Responsabilidad',
      content: `CEOSMOS se proporciona "tal cual" y "según disponibilidad" sin ninguna garantía de ningún tipo. En ningún caso CEOSMOS, sus directores, empleados, socios o agentes serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluida la pérdida de datos, ingresos, beneficios o cualquier otra pérdida intangible.`
    },
    {
      icon: 'edit_note',
      title: 'Modificaciones',
      content: `Nos reservamos el derecho, a nuestra entera discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso de al menos 15 días antes de que entren en vigor los nuevos términos. El uso continuado de la plataforma después de dichos cambios constituye tu aceptación de los nuevos términos.`
    },
    {
      icon: 'gavel',
      title: 'Ley Aplicable',
      content: `Estos Términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Nuestra incapacidad para hacer cumplir cualquier derecho o disposición de estos Términos no se considerará una renuncia a esos derechos.`
    }
  ];

  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
