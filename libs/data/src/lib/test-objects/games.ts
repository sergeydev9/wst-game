import { Game } from "@whosaidtrue/app-interfaces";
const games: Game[] = [
    {
        id: 1,
        host_id: 1,
        host_name: 'test name 1',
        access_code: 'ABCDEA',
        status: 'in-progress',
        deck_id: 1,
        start_date: new Date(),
    },
    {
        id: 2,
        host_id: 2,
        host_name: 'test name 2',
        access_code: 'ABCDEB',
        status: 'in-progress',
        deck_id: 1,
        start_date: new Date(),
    },
    {
        id: 3,
        host_id: 3,
        host_name: 'test name 3',
        access_code: 'ABCDEC',
        status: 'in-progress',
        deck_id: 1,
        start_date: new Date(),
    }
];

export default games;