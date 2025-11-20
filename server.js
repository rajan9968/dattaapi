const express = require('express');
const config = require('./config/db');
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const app = express();
const authRouter = require('./routes/authRoute');
const bannerRouter = require('./routes/bannerRoute');
const businessRouter = require('./routes/businessRoute');
const clientLogoRoutes = require('./routes/clientLogoRoute');
const sustainabilityRoute = require('./routes/sustainabilityRoute');
const portfolioRoute = require('./routes/portfolioRoute');
const careerRoute = require('./routes/careerRoute');
const aboutOneRoute = require('./routes/aboutOneRoute');
const comOneRoute = require('./routes/comOneRoute');
const purposeRoute = require('./routes/purposeRoute');
const coreValuesRoute = require('./routes/coreValuesRoute');
const timelineRoute = require('./routes/timelineRoute');
const leadershipRoute = require('./routes/leadershipRoute');
const managementRoute = require('./routes/managementRoute');
const projectRoute = require('./routes/projectRoute');
const portfolioOverviewRoute = require('./routes/portfolioOverviewRoute');
const PreDevelopmentRoute = require('./routes/PreDevelopmentRoute');
const CultureRoute = require('./routes/CultureRoute');
const awardsRoute = require('./routes/awardsRoute');
const contactRoute = require('./routes/contactRoute');
const careersRoute = require('./routes/careersRoute');
const pressReleaseRoute = require('./routes/pressReleaseRoute');
const PressBannerRoute = require('./routes/PressBannerRoute');
const MediaBannerRoute = require('./routes/MediaBannerRoute');
const MediaReleaseRoute = require('./routes/MediaReleaseRoute');
const FAQsRoute = require('./routes/FAQsBannerRoute');
const faqsQuestionsRoute = require('./routes/faqsQuestionsRoute');
const BlogBannerRoute = require('./routes/BlogBannerRoute');
const blogDetailRoute = require('./routes/blogDetailRoute');
const CaseStudiesBannerRoute = require('./routes/CaseStudiesBannerRoute');
const CaseStudiesRoute = require('./routes/CaseStudiesRoute');
const bussinessHeadingRoute = require('./routes/bussinessHeadingRoute');
const sustainabilityHeadingRoute = require('./routes/sustainabilityHeadingRoute');
const portfolioHeadingRoute = require('./routes/portfolioHeadingRoute');
const mappingRoute = require('./routes/mappingRoute');
const portfolioPageHeadingRoute = require('./routes/portfolioPageHeadingRoute');
const careersHeadingRoute = require('./routes/careersHeadingRoute');
const cultureportfolioRoute = require('./routes/cultureportfolioRoute');
const ResourcesPhotoRoute = require('./routes/ResourcesPhotoRoute');
const ResourcesVideoRoute = require('./routes/ResourcesVideoRoute');
const catRoute = require('./routes/catRoute');
const subcatRoute = require('./routes/subcatRoute');
const investorRoute = require('./routes/investorRoute');
const contactMailRoute = require('./routes/contactMailRoute');


const cors = require('cors')
require('dotenv').config();

const checkSecretKey = require('./Middleware/checkSecretKey');

// -------------------------------
// 1. CORS
// -------------------------------
app.use(
    cors({
        origin: "http://localhost:3000",
    })
);

// -------------------------------
// 2. Security Headers (Helmet)
// -------------------------------
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                connectSrc: ["'self'", "http://localhost:3000"],
                imgSrc: ["'self'", "data:", "blob:"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
        frameguard: { action: "deny" },            // ❌ Prevent clickjacking
        xssFilter: true,                          // ❌ XSS protection
        noSniff: true,                            // ❌ MIME sniffing
        hidePoweredBy: true,                      // ❌ Remove X-Powered-By: Express
        referrerPolicy: { policy: "strict-origin" },
        hsts: { maxAge: 31536000, includeSubDomains: true },  // ❌ Force HTTPS
        dnsPrefetchControl: { allow: false },
        ieNoOpen: true,
    })
);

// -------------------------------
// 3. Rate Limit
// -------------------------------
const limiter = rateLimit({
    windowMs: 60 * 1000,   // 1 minute
    max: 200,               // 200 requests per minute
    message: { message: "Too many requests. Slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// -------------------------------
// 4. Bot + Burp Suite Detection
// -------------------------------
function detectBot(req) {
    const ua = req.headers["user-agent"]?.toLowerCase() || "";
    const ref = req.headers.referer || "";
    const h = req.headers;

    // ---- Block Burp Suite ----
    const burpPatterns = ["burp", "java", "apache-httpclient"];
    if (burpPatterns.some(x => ua.includes(x))) return true;

    const burpRequiredHeaders = [
        "sec-fetch-mode",
        "sec-fetch-site",
        "sec-ch-ua",
        "sec-ch-ua-platform"
    ];
    for (let r of burpRequiredHeaders) {
        if (!h[r]) return true;
    }

    // ---- Existing bot rules ----

    if (!ua || ua.trim() === "") return true;

    const botPatterns = [
        "bot", "crawler", "spider", "curl",
        "python", "axios", "scraper", "postman"
    ];
    if (botPatterns.some((x) => ua.includes(x))) return true;

    const realBrowsers = ["chrome", "firefox", "safari", "edge", "opera"];
    const isRealBrowser = realBrowsers.some((x) => ua.includes(x));
    if (!isRealBrowser) return true;

    const requiredHeaders = ["accept", "accept-language", "sec-fetch-mode", "sec-ch-ua"];
    for (let key of requiredHeaders) {
        if (!h[key]) return true;
    }

    if (!ref.includes("localhost:3000")) return true;

    return false;
}

// -------------------------------
// 5. Middleware — Block bots
// -------------------------------
app.use((req, res, next) => {
    if (detectBot(req)) {
        return res.status(403).json({ message: "Blocked." });
    }
    next();
});




app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
})

app.use(express.json());
// app.use(cors())

app.use('/uploads', express.static('uploads'));

app.use('/auth', authRouter);


app.use(checkSecretKey);



app.use('/banners', bannerRouter);
app.use('/business', businessRouter);
app.use('/client-logos', clientLogoRoutes);
app.use('/sustainability', sustainabilityRoute);
app.use('/portfolio', portfolioRoute);
app.use('/career', careerRoute);
app.use('/about-banner', aboutOneRoute);
app.use('/com-banner', comOneRoute);
app.use('/purpose', purposeRoute);
app.use('/values', coreValuesRoute);
app.use('/timeline', timelineRoute);
app.use('/leadership', leadershipRoute);
app.use('/management', managementRoute);
app.use('/project', projectRoute);
app.use('/portfolio-overview', portfolioOverviewRoute);
app.use('/pre-development', PreDevelopmentRoute);
app.use('/culture', CultureRoute);
app.use('/awards-data', awardsRoute);
app.use('/contact-data', contactRoute);
app.use('/careers-data', careersRoute);
app.use('/press-releases', pressReleaseRoute);
app.use('/press-banner', PressBannerRoute);
app.use('/media-banner', MediaBannerRoute);
app.use('/media-releases', MediaReleaseRoute);
app.use('/faqs', FAQsRoute);
app.use('/faqs-questions', faqsQuestionsRoute);
app.use('/blog-banner', BlogBannerRoute);
app.use('/blog-detail', blogDetailRoute);
app.use('/case-studies-banner', CaseStudiesBannerRoute);
app.use('/case-studies', CaseStudiesRoute);
app.use('/business-heading', bussinessHeadingRoute);
app.use('/sustainability-heading', sustainabilityHeadingRoute);
app.use('/portfolio-heading', portfolioHeadingRoute);
app.use('/mapping', mappingRoute);
app.use('/portfolio-page-heading', portfolioPageHeadingRoute);
app.use('/careers-heading', careersHeadingRoute);
app.use('/culture-portfolio', cultureportfolioRoute);
app.use('/resources-photo', ResourcesPhotoRoute);
app.use('/resources-video', ResourcesVideoRoute);
app.use('/cat', catRoute);
app.use('/sub-cat', subcatRoute);
app.use('/investor', investorRoute);
app.use('/mail', contactMailRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
})
