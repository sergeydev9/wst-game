import { UserInsertObject } from "@whosaidtrue/app-interfaces"

export const cypressTestUsers: UserInsertObject[] = [
    { email: 'cypress-test-user@email.com', password: 'Password123', role: "user" },
    { email: 'cypress-test-guest@email.com', password: 'Password123', role: "guest" },
    { email: 'cypress-test-test@email.com', password: 'Password123', role: "test" },

]