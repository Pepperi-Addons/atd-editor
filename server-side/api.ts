import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'

// add functions here
// this function will run on the 'api/foo' endpoint
// the real function is runnning on another typescript file
export async function transaction_types(client: Client, request: Request) {
    const service = new MyService(client)
    // const transactioTypes = await service.getTransactionTypes();
    // const listMenu = await service.getListMenu();
    // return res;
};
