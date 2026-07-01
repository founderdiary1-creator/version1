import { FooterInfoBands } from './FooterInfoBands';
import { FooterLinks } from './FooterLinks';
import { FooterNewsletter } from './FooterNewsletter';

export function Footer() {
  return (
    <footer>
      <FooterInfoBands />
      <FooterLinks />
      <FooterNewsletter />
    </footer>
  );
}
