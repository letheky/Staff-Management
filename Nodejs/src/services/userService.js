import db from '../models/index'
import bcrypt from 'bcrypt'

let handleUserLogin = (username,password) => {
    return new Promise(async (resolve, reject)=>{
        try{
            let userData = {}

            let isExist = await checkUserName(username);
            if(isExist){
                let user = await db.User.findOne({
                    attributes: ['userName','roleId','password'],
                    where: {userName: username},
                    raw:true
                })
                if(user){
                    let check = await bcrypt.compareSync(password,user.password)
                    if(check){
                        userData.errCode = 0
                        userData.errMessage = 'Ok'

                        delete user.password
                        userData.user = user
                    }else {
                        userData.errCode = 3
                        userData.errMessage = 'Wrong password'
                    }
                } else{
                    userData.errCode = 2
                    userData.errMessage = 'User is not found'
                }
            }else{
                userData.errCode = 1
                userData.errMessage = `Username isn't exist`
            }
            resolve(userData)
        }
        catch(err){
            reject(err)
        }
    })
}

let checkUserName = userName =>{
    return new Promise(async(resolve, reject)=>{
        try{
            let user = await db.User.findOne({
                where: {userName: userName}
            })
            if(user){
                resolve(true)
            }else{
                resolve(false)
            }
        }catch(err){
            reject(err)
        }
    })
}

module.exports ={
    handleUserLogin
}