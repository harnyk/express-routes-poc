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

        this.get = method.bind(this, 'get');
        this.post = method.bind(this, 'post');
        this.put = method.bind(this, 'put');
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
            req.params.uniqueName = eventUniqueName;
            req.isCustomDomain = true;
        } else {
            req.isCustomDomain = false;
        }

        next();
    }
}

function method(methodName, url, ...handlers) {
    this.bizzaboRouter[methodName](`/:uniqueName${url}`, ...handlers);
    this.domainRouter[methodName](url, addUniqueName, ...handlers);
}

const addUniqueName = (req, res, next) => {
    req.params.uniqueName = req.eventUniqueName;
    next();
};

const isCustomDomain = req => {
    return req.isCustomDomain;
};

//-------

module.exports = CustomDomainRouter;
