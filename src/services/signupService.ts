import constant from "../common/constant";
import commonService from "./commonService";
import * as async from "async";
import * as crypto from "crypto";
import { models } from "../models/model";
import { routerResponse } from "../common/responseQuery";

export interface EntityAttributes { }

export class SignupService {

    public signupWithUser(req: any, callback: Function) {
        var data = req.body;

        async.waterfall([
            function (waterfallCallback: Function) {
                var isValidPassword = routerResponse.checkPassword(data.password)
                if (isValidPassword == false) {
                    return callback(null, constant.InValidPassword)
                } else {
                    waterfallCallback(null, null)
                }
            },
            function (dummy: any, waterfallCallback: Function) {

                commonService.findOne({ where: { email: data.email, user_name: data.user_name } }, models.User, function (err: any, response: any) {
                    if (err) return waterfallCallback(err, null);
                    if (response) {
                        if (response.user_name == data.user_name) return callback(new Error("Username number already exist."), null);
                        if (response.email == data.email) return callback(new Error("Email already exist."), null);
                        return callback(new Error("Something went wrong"), null);
                    } else {
                        waterfallCallback(null, null);
                    }
                })
            },
            function (Dummy: any, waterfallCallback: Function) {

                data.salt = crypto.randomBytes(16).toString('hex');
                data.password_string = crypto.pbkdf2Sync(data.password, data.salt, 1000, 64, `sha512`).toString(`hex`);

                data.created_at = new Date().toISOString();

                commonService.findOrCreate({ email: data.email }, data, models.User, function (err: any, response: any) {
                    waterfallCallback(err, response);
                })
            },
        ], function (err, result) {
            callback(err, result);
        })
    }

    public userDelete(req: any, callback: Function) {
        var query = req.query;

        var condition: any = {
            where: {
                user_id: query.user_id
            }
        }
        var reqData: any = {
            status: "InActive"
        }

        commonService.update(reqData, condition, models.User, function (err: Error, response: any) {
            if (err) return callback(err);
            callback(null, "User Deleted")
        })
    }

}

export const signupService = new SignupService()
export default signupService