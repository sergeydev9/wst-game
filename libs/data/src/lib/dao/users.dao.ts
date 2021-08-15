import Dao from './base.dao';

class Users extends Dao {
    getById = async (id: string) => {
        const { rows } = await this.pool.query(`SELECT * FROM users WHERE id = ${id}`);
        return rows[0];
    }

    setPassword = async (id: string, newPassword: string) => {
        const { rows } = await this.pool.query(`UPDATE`)
    }
}

export default Users;