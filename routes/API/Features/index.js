import express from "express";
import { PrismaClient } from "@prisma/client";
import EmailExistenceRoutes from "/EmailExistence";
import EmailSpammerRoutes from "./EmailSpammer/index.js";
import GenerateFakeIdentityRoutes from "./GenerateFakeIdentity/index.js";
import InformationCrawlerFromFirstLastNameRoutes from "./InformationCrawlerFromFirstLastName/index.js";
import PasswordCheckRoutes from "./PasswordCheck/index.js";
import PhishingServiceRoutes from "./PhishingService/index.js";
import RandomImageChangeRoutes from "./RandomImageChange/index.js";
import RetrieveDomainsSubdomainsFromDomainNameRoutes from "./RetrieveDomainsSubdomainsFromDomainName/index.js";
import SecurePasswordGeneratorRoutes from "./SecurePasswordGenerator/index.js";

const router = express.Router();


router.use('/emailExistence', EmailExistenceRoutes);
router.use('/emailSpammer', EmailSpammerRoutes);
router.use('/generateFakeIdentity', GenerateFakeIdentityRoutes);
router.use('/crawler', InformationCrawlerFromFirstLastNameRoutes);
router.use('/passwordCheck', PasswordCheckRoutes);
router.use('/phishingService', PhishingServiceRoutes);
router.use('/randomImageChange', RandomImageChangeRoutes);
router.use('/retrieveAlldomains', RetrieveDomainsSubdomainsFromDomainNameRoutes);
router.use('/securePasswordGenerator', SecurePasswordGeneratorRoutes);

export default router;
