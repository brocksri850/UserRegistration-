import jwtUtils from "../../utils/jwtUtils";
import { models } from "../models/model";
import commonService from "./commonService";
import * as async from "async";
import * as crypto from "crypto";
import constant from "../common/constant";
import * as  _ from "lodash";
import { any } from "sequelize/types/lib/operators";

export interface EntityAttributes { }

export class LoginService {



    public login(req: any, callback: Function) {

        var data = req.body;
        async.waterfall([

            function (waterfallCallback: Function) {
                var condition: any = {
                    where: {
                        email: data.email,
                        status: "Active"
                    }
                }
                commonService.findOne(condition, models.User, function (err: Error, userDtl: any) {
                    if (_.isEmpty(userDtl)) return waterfallCallback(new Error(constant.Error1), null);
                    waterfallCallback(err, userDtl)
                })
            },
            function (userDtl: any, waterfallCallback: Function) {
                var condition: any = {
                    where: {
                        user_id: userDtl.user_id
                    }
                }

                if (userDtl.password != data.password) {
                    if ((userDtl.is_attempts == 3) && (loginService.isDateLessFiveMinuites(userDtl.created_at))) {
                         return callback(null,"Blocked")
                    }
                    else {
                        userDtl.is_attempts += 1;
                    }
                } else {
                    userDtl.is_attempts = 0
                }

                var reqData: any = {
                    is_attempts: userDtl.is_attempts
                }

                commonService.update(reqData, condition, models.User, function (err: Error, response: any) {
                    if (err) return callback(err);
                    if (response[0] == 1) return callback(null, "Password Incorrect");
                    waterfallCallback(null, userDtl)
                })
            },
            function (userDtl: any, waterfallCallback: Function) {
                var password_string = crypto.pbkdf2Sync(data.password, userDtl.salt, 1000, 64, `sha512`).toString(`hex`);

                if (userDtl.password_string === password_string) {
                    loginService.loginSessionCreate(userDtl, function (err: Error, response: any) {
                        waterfallCallback(err, response.payload)
                    })
                } else {
                    var error = new Error(constant.InCorPass)
                    waterfallCallback(error, null);
                }
            }
        ], function (err, result) {
            callback(err, result)
        })
    }

    public loginSessionCreate(userDtl: any, callback: Function) {

        var payload: any = {
            user_id: userDtl.user_id,
            first_name: userDtl.first_name,
            last_name: userDtl.last_name,
            email: userDtl.email,
            phone_number: userDtl.phone_number,
            user_name: userDtl.user_name
        }
        async.waterfall([
            function (waterfallCallback: Function) {
                var requiredStringForJwtToken = "User#Id_" + userDtl.user_id;

                jwtUtils.jwtSign({ redisId: requiredStringForJwtToken }, function (err: any, token: any) {
                    if (err) return waterfallCallback(new Error(constant.loginErr), null);
                    return waterfallCallback(null, token, requiredStringForJwtToken)
                })

            },
            function (jwtToken: any, requiredStringForJwtToken: any, waterfallCallback: Function) {

                payload.accessToken = jwtToken.accessToken;
                payload.created_dt = new Date();
                payload.key = requiredStringForJwtToken

                var data: any = {};

                data.key = requiredStringForJwtToken
                data.payload = payload;

                var reqFinalJson: any = {
                    payload: payload,
                }
                commonService.update(data, { where: { user_id: userDtl.user_id } }, models.User, function (err: Error, payload: any) {
                    waterfallCallback(err, reqFinalJson)
                })
            }
        ], function (err, result) {
            callback(err, result)
        })
    }

    public isDateLessFiveMinuites(dateString: any) {
        //new Date.parseExact(dateString, "yyyy-mm-dd hh-mm");
        var date1 =  new Date(dateString).getTime() / 1000;
        var date2 = new Date().getTime() / 1000;
        if ((date2 - date1) > 300) {
            return true
        }
        return false
    }

}

export const loginService = new LoginService();
export default loginService