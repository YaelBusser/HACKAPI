import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
            description: "Documentation de l'API hackapi",
        },
        servers: [
            {
                url: process.env.URL,
                description: "Serveur local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                },
            },
        },
    },
    apis: ["./routes/API/*/*.js", "./routes/API/*/*/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export {swaggerDocs, swaggerUi};
