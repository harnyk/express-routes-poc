const conditional = require('express-conditional-middleware');
const express = require('express');
const Router = express.Router;

const mockDomainsMap = {
    'garkin.im': '1000012',
    'mark.com.ua': '1000099'
};

class CustomDomainRouter {
    constructor() {
        this.bizzaboRouter = Router();
        this.domainRouter = Router();
    }

    get(url, ...handlers) {
        this.bizzaboRouter.get(`/:uniqueName${url}`, ...handlers);
        this.domainRouter.get(url, ...handlers);
    }

    middleware() {
        return conditional(
            isCustomDomain,
            this.domainRouter,
            this.bizzaboRouter
        );
    }

    static init(req, res, next) {
        const { hostname } = req;
        
        console.log(`host=${hostname}`);
        if (mockDomainsMap.hasOwnProperty(hostname)) {
            const eventUniqueName = mockDomainsMap[hostname];
            console.log(`eventUniqueName=${eventUniqueName}`);
            req.eventUniqueName = eventUniqueName;
            req.isCustomDomain = true;
        } else {
            req.isCustomDomain = false;
        }

        next();
    }
}

const isCustomDomain = req => {
    return req.isCustomDomain;
};

//-------

module.exports = CustomDomainRouter;
