const router = require("express").Router();
const auth = require("../middleware/auth");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", auth, async (req, res) => {
    try {

        const {name} = req.body;


        const savedCustomer = await prisma.customer.create({
            data: {
                name
            }
        })

        res.json(savedCustomer);

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get("/", auth, async (req, res) => {
    try {
        const customers = await prisma.customer.findMany();
        res.json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;