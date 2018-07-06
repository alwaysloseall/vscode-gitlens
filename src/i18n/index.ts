import en_US from './en_US';
import zh_CN from './zh_CN';
import { workspace } from 'vscode';
import { IConfig } from '../ui/config';

let lang = en_US;

const config = workspace.getConfiguration().get<IConfig>('gitlens');

switch (config && config.display.language) {
    case 'zh_CN':
        lang = { ...en_US, ...zh_CN };
        break;
    default:
        break;
}

export default lang;