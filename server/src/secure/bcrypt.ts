import bcrypt from 'bcrypt';

const salt_rounds = 10;

export const generate_salt = async (password: string): Promise<string> => {
    await bcrypt.hash(password, salt_rounds)
        .then((hash) => { 
          password = hash;
        })
        .catch(error => { throw error })
  
    return password;
}

export const check_password = async (password: string, hash: string): Promise<boolean> => {
    var auth_success = false;
    await bcrypt.compare(password, hash).then((result) => { auth_success = result}).catch(error => { throw error });
    return auth_success;
}