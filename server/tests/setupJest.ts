require('module-alias/register');
import 'module-alias/register';
import { sync } from '@models/SyncModels';

export default async () => {
    await sync();
};
