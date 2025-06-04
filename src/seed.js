// scripts/seed.js
// Note: Make sure to compile the TypeScript files before running this script: npm run build
import mongoose from 'mongoose';
import { performance } from 'perf_hooks';
import dotenv from 'dotenv';
import { AccountModel } from '../dist/models/account.model.js';
import { ContactModel } from '../dist/models/contact.model.js';
import { EventModel } from '../dist/models/event.model.js';

// Load environment variables from .env file
dotenv.config();

// MongoDB connection URI - using the same configuration as in app.ts
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/v2_fastify';
console.log('Using MongoDB URI:', MONGODB_URI);

// Helper function to generate random data
function generateRandomData() {
    const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail', 'Media', 'Transportation', 'Energy', 'Construction'];
    const sizeEEs = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001-10000', '10000+'];
    const sizeRevs = ['<1M', '1M-10M', '10M-50M', '50M-100M', '100M-500M', '500M-1B', '>1B'];
    const reps = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown', 'Diana Miller', 'Edward Davis', 'Fiona Wilson'];
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'example.com', 'company.com', 'business.org'];
    const eventNames = ['pageView', 'click', 'formSubmit', 'download', 'signup', 'login', 'purchase', 'share', 'comment', 'search'];
    const eventValues = [
        1,
        { time: Math.random() * 10 },
        'clicked',
        'submitted',
        'completed',
        { duration: Math.floor(Math.random() * 60) },
        { count: Math.floor(Math.random() * 5) + 1 },
        true,
        { success: Math.random() > 0.3 },
        { error: 'timeout' }
    ];
    const pages = ['home', 'about', 'products', 'services', 'contact', 'blog', 'pricing', 'support', 'faq', 'login'];
    const actions = ['view', 'click', 'scroll', 'hover', 'submit', 'download', 'play', 'pause', 'share', 'like'];

    return {
        industry: industries[Math.floor(Math.random() * industries.length)],
        sizeEE: sizeEEs[Math.floor(Math.random() * sizeEEs.length)],
        sizeRev: sizeRevs[Math.floor(Math.random() * sizeRevs.length)],
        rep: reps[Math.floor(Math.random() * reps.length)],
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        domain: domains[Math.floor(Math.random() * domains.length)],
        eventName: eventNames[Math.floor(Math.random() * eventNames.length)],
        eventValue: eventValues[Math.floor(Math.random() * eventValues.length)],
        page: pages[Math.floor(Math.random() * pages.length)],
        action: actions[Math.floor(Math.random() * actions.length)]
    };
}

// Helper function to generate a random string ID
function generateId(prefix) {
    return `${prefix}_${Math.random().toString(36).substring(2, 15)}`;
}

// Helper function to calculate and display ETA
function displayETA(startTime, totalItems, completedItems, label) {
    const elapsedTime = (performance.now() - startTime) / 1000; // in seconds
    const itemsPerSecond = completedItems / elapsedTime;
    const remainingItems = totalItems - completedItems;
    const estimatedTimeRemaining = remainingItems / itemsPerSecond;

    const minutes = Math.floor(estimatedTimeRemaining / 60);
    const seconds = Math.floor(estimatedTimeRemaining % 60);

    console.log(`${label}: ${completedItems}/${totalItems} (${(completedItems / totalItems * 100).toFixed(2)}%) - ETA: ${minutes}m ${seconds}s`);
}

// Main function to seed the database
async function seedDatabase() {
    const totalStartTime = performance.now();
    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB!');

        // Clear collections
        console.log('Clearing collections...');
        await AccountModel.deleteMany({});
        await ContactModel.deleteMany({});
        await EventModel.deleteMany({});
        console.log('Collections cleared!');

        // Seed Accounts
        console.log('Seeding Accounts...');
        const totalAccounts = 10000;
        const accountBatchSize = 1000;
        const accountIds = [];
        const accountStartTime = performance.now();

        for (let i = 0; i < totalAccounts; i += accountBatchSize) {
            const batch = [];
            const batchSize = Math.min(accountBatchSize, totalAccounts - i);

            for (let j = 0; j < batchSize; j++) {
                const randomData = generateRandomData();
                const aid = generateId('acc');
                accountIds.push(aid);

                batch.push({
                    aid,
                    accountName: `Account ${i + j + 1}`,
                    industry: randomData.industry,
                    sizeEE: randomData.sizeEE,
                    sizeRev: randomData.sizeRev,
                    rep: randomData.rep,
                    company_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                    dynamic: {
                        opportunity: Math.random() > 0.5 ? 'High' : Math.random() > 0.5 ? 'Medium' : 'Low'
                    }
                });
            }

            await AccountModel.insertMany(batch);
            displayETA(accountStartTime, totalAccounts, i + batchSize, 'Accounts');
        }

        console.log('Accounts seeded successfully!');

        // Seed Contacts
        console.log('Seeding Contacts...');
        const totalContacts = 100000;
        const contactBatchSize = 5000;
        const contactIds = [];
        const contactStartTime = performance.now();

        for (let i = 0; i < totalContacts; i += contactBatchSize) {
            const batch = [];
            const batchSize = Math.min(contactBatchSize, totalContacts - i);

            for (let j = 0; j < batchSize; j++) {
                const randomData = generateRandomData();
                const cid = generateId('con');
                contactIds.push(cid);

                // Assign to a random account
                const aid = accountIds[Math.floor(Math.random() * accountIds.length)];

                batch.push({
                    cid,
                    aid,
                    firstName: randomData.firstName,
                    lastName: randomData.lastName,
                    emails: [`${randomData.firstName.toLowerCase()}.${randomData.lastName.toLowerCase()}@${randomData.domain}`],
                    fingerprint: `fp_${Math.random().toString(36).substring(2, 15)}`,
                    dynamic: {
                        lastPage: randomData.page,
                        lastAction: randomData.action,
                        lastDemoNotes: Math.random() > 0.7 ? `Notes for demo on ${new Date().toISOString().split('T')[0]}` : null
                    },
                    anon: Math.random() > 0.9
                });
            }

            await ContactModel.insertMany(batch);
            displayETA(contactStartTime, totalContacts, i + batchSize, 'Contacts');
        }

        console.log('Contacts seeded successfully!');

        // Seed Events
        console.log('Seeding Events...');
        const totalEvents = 1000000;
        const eventBatchSize = 10000;
        const eventStartTime = performance.now();

        for (let i = 0; i < totalEvents; i += eventBatchSize) {
            const batch = [];
            const batchSize = Math.min(eventBatchSize, totalEvents - i);

            for (let j = 0; j < batchSize; j++) {
                const randomData = generateRandomData();

                // Assign to a random contact
                const cid = contactIds[Math.floor(Math.random() * contactIds.length)];

                // Make sure the fields match the Event model schema
                batch.push({
                    cid,
                    name: randomData.eventName,
                    value: randomData.eventValue
                });
            }

            await EventModel.insertMany(batch);
            displayETA(eventStartTime, totalEvents, i + batchSize, 'Events');
        }

        console.log('Events seeded successfully!');

        console.log('Database seeding completed successfully!');

        // Calculate and display total import time
        const totalElapsedTime = (performance.now() - totalStartTime) / 1000; // in seconds
        const totalMinutes = Math.floor(totalElapsedTime / 60);
        const totalSeconds = Math.floor(totalElapsedTime % 60);
        console.log(`Total import time: ${totalMinutes}m ${totalSeconds}s`);
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
}

// Run the seeder
seedDatabase();
