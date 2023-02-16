import { prisma } from "../server/db";
import stripe from "./stripe";

const upsertProductRecord = async (product: Stripe.Product) => {
  if (product.active) {
    const productData = {
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description ?? undefined,
      image: product.images?.[0] ?? null,
      metadata: product.metadata,
    };
    try {
      const user = await prisma.product.upsert({
        where: { id: productData.id },
        update: { ...productData },
        create: { ...productData },
      });
      console.log(`Product inserted/updated: ${product.id}`);
    } catch (error) {
      throw error;
    }
  }
};

const updateCustomerRecord = async (subscription: any, cancel?: boolean) => {
  console.log("UPDATE CUSTOMER RECORD");
  console.log(subscription);
  const customerData = {
    stripe_customer_id: subscription.customer,
    billingPlan: subscription.plan,
  };

  try {
    //get prduct using the product id from subscription
    const product = await prisma.product.findUnique({
      where: { id: subscription.plan.product },
    });

    const billingPlan = subscription.canceled_at ? null : product?.name;

    await prisma.customer.updateMany({
      where: { stripe_customer_id: subscription.customer },
      data: { billingPlan: billingPlan },
    });

    console.log("Customer updated");
  } catch (error) {
    throw error;
  }
};

const createOrRetrieveCustomer = async (userId: String) => {
  try {
    let stripe_customer: any = {};
    const db_customer = await prisma.customer.findFirst({
      where: {
        userId: userId,
      },
    });

    if (db_customer) {
      //if customer in database exists return data from stripe
      stripe_customer = await stripe.customers.retrieve(
        db_customer.stripe_customer_id
      );
    } else {
      //create new user and return
      stripe_customer = await stripe.customers.create({});

      //insert the new user into database
      await prisma.customer.create({
        data: { userId: userId, stripe_customer_id: stripe_customer.id },
      });
    }

    return stripe_customer;
  } catch (error) {
    console.error(error);
  }
};

export { upsertProductRecord, createOrRetrieveCustomer, updateCustomerRecord };
