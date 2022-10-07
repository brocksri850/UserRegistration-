import { Router } from "express";
import { routerResponse } from "../common/responseQuery";
import loginService from "../services/loginService";
import signupService from "../services/signupService";

export class UserRouter {
    public router;

    constructor() {
        this.router = Router();
        this.init()

    }
    init() {

        this.router.post("/signup", this.signupWithUser);
        this.router.post("/login", this.login);
        this.router.get("/getall", this.getAllUser);
        this.router.put("/userdel", this.userDelete);
    }

    public signupWithUser(req: any, res: any) {
        try {
            signupService.signupWithUser(req, function (err: Error, response) {
                var commonResponse = routerResponse.objResponse(err, response, req, res);
                res.send(commonResponse);
            });
        } catch (err) {
            var commonResponse = routerResponse.objResponse(err, null, req, res);
            res.send(commonResponse);
        }
    }

    
    public login(req: any, res: any) {
        try {
            loginService.login(req, function (err: Error, response) {
                var commonResponse = routerResponse.objResponse(err, response, req, res);
                res.send(commonResponse);
            });
        } catch (err) {
            var commonResponse = routerResponse.objResponse(err, null, req, res);
            res.send(commonResponse);
        }
    }

    public getAllUser(req: any, res: any) {
        try {
            signupService.getAllUser(req, function (err: Error, response) {
                var commonResponse = routerResponse.objResponse(err, response, req, res);
                res.send(commonResponse);
            });
        } catch (err) {
            var commonResponse = routerResponse.objResponse(err, null, req, res);
            res.send(commonResponse);
        }
    }

    public userDelete(req: any, res: any) {
        try {
            signupService.userDelete(req, function (err: Error, response) {
                var commonResponse = routerResponse.objResponse(err, response, req, res);
                res.send(commonResponse);
            });
        } catch (err) {
            var commonResponse = routerResponse.objResponse(err, null, req, res);
            res.send(commonResponse);
        }
    }

}
var userRouter = new UserRouter();
const router = userRouter.router
export default router