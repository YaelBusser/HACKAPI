import express from "express";
import EmailExistenceRoutes from "./EmailExistence/index.js";
import EmailSpammerRoutes from "./EmailSpammer/index.js";
import GenerateFakeIdentityRoutes from "./GenerateFakeIdentity/index.js";
import InformationCrawlerFromFirstLastNameRoutes from "./InformationCrawlerFromFirstLastName/index.js";
import PasswordCheckRoutes from "./PasswordCheck/index.js";
import PhishingServiceRoutes from "./PhishingService/index.js";
import RandomImageChangeRoutes from "./RandomImageChange/index.js";
import RetrieveDomainsSubdomainsFromDomainNameRoutes from "./RetrieveDomainsSubdomainsFromDomainName/index.js";
import SecurePasswordGeneratorRoutes from "./SecurePasswordGenerator/index.js";
import DdosRoutes from "./Ddos/index.js";

const router = express.Router();


router.use('/email-existence', EmailExistenceRoutes);
router.use('/email-spammer', EmailSpammerRoutes);
router.use('/generate-fake-identity', GenerateFakeIdentityRoutes);
router.use('/crawler', InformationCrawlerFromFirstLastNameRoutes);
router.use('/password-check', PasswordCheckRoutes);
router.use('/phishing-service', PhishingServiceRoutes);
router.use('/random-image-change', RandomImageChangeRoutes);
router.use('/retrieve-all-domains', RetrieveDomainsSubdomainsFromDomainNameRoutes);
router.use('/secure-password-generator', SecurePasswordGeneratorRoutes);
router.use('/ddos', DdosRoutes);

export default router;
