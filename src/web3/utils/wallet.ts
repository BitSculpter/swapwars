import { config } from 'src/config';

export const installWallet = () => window.open(config.wallets.download.metamask, '_blank');
