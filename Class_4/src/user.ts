import { LevelDB } from "./leveldb"
import WriteStream from 'level-ws'

export class User {
    public username: string
    public email: string
    private password: string = ""
  
    constructor(username: string, email: string, password: string, passwordHashed: boolean = false) {
      this.username = username
      this.email = email
  
      if (!passwordHashed) {
        this.setPassword(password)
      } else this.password = password
    }

    static fromDb(username: string, value: any): User {
        const [password, email] = value.split(":");
        return new User(username, email, password);
    }
    
    public setPassword(toSet: string): void {
        this.password = toSet
    }
    
    public getPassword(): string {
        return this.password
    }
    
    public validatePassword(toValidate: String): boolean {
        if (toValidate == this.password) 
            return true;
        else
            return false;
    }
}


export class UserHandler {
    public db: any
  
    public get(username: string, callback: (err: Error | null, result?: User) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err)
            else if (data === undefined) callback(null, data)
            callback(null, User.fromDb(username, data))
        })
    }
      
    public save(user: User, callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`, `${user.getPassword}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }
      
    public delete(username: string, callback: (error: Error | null | string, result?: any) => void) {
          this.db.get(`user:${username}`,(first_err: Error | null, first_res: any) => {
                if (first_res != null) {
                    this.db.del(`user:${username}`, (err: Error | null) => {
                        if (err) 
                            callback(err, null);
                        else {
                        this.db.get(`user:${username}`,(get_err: Error | null, get_res: any) => {
                            if (get_res) 
                                callback("delete failed", null);
                            else 
                                callback(null, "delete succeded");
                            }
                        );
                        }
                    });
                }
                else 
                    {callback("user not found", null);}
            })
    }

    public put(username: string,callback: (error: Error | null | string, result?: any) => void, email?: string, password?: string) {
        this.db.get(`user:${username}`, (first_err: Error | null, first_res: any) => {
            if (first_res) {
              let usr = first_res;
              usr = { ...usr,email: email ? email : usr.email, password: password ? password : usr.password}
              this.db.del(`user:${username}`, (err: Error | null) => {
                if (err) 
                    callback(err, null);
                else {
                    this.db.put( `user:${username}`, `${usr.password}:${usr.email}`, (put_err: Error | null) => {
                        if (put_err) 
                            callback("update failed", null);
                        else callback(null, "update succeded");
                    }
                  );
                }
              });
            }
            else callback("user not found", null);
          }
        );
      }    
      
    constructor(path: string) {
        this.db = LevelDB.open(path)
    }
}