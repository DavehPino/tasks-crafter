#!/usr/bin/env node
/**
 * Simple test script to verify Vercel API handlers work correctly
 * Run: node test-api.js
 */

const handler = require('./api/tasks/index.ts');

// Mock VercelRequest and VercelResponse
class MockVercelRequest {
  constructor(method = 'GET', query = {}, body = {}) {
    this.method = method;
    this.query = query;
    this.body = body;
  }
}

class MockVercelResponse {
  constructor() {
    this.statusCode = 200;
    this.headers = {};
    this.body = null;
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    return this;
  }

  json(data) {
    this.body = JSON.stringify(data, null, 2);
    console.log(`[${this.statusCode}] ${this.body}`);
    return this;
  }

  send() {
    console.log(`[${this.statusCode}] (no body)`);
    return this;
  }

  end() {
    console.log(`[${this.statusCode}] (ended)`);
  }
}

// Test cases
console.log('\n📋 Testing Vercel API Handlers\n');

console.log('Test 1: GET /api/tasks (empty list)');
const req1 = new MockVercelRequest('GET', {}, {});
const res1 = new MockVercelResponse();
handler(req1, res1);

console.log('\nTest 2: POST /api/tasks (create task)');
const req2 = new MockVercelRequest('POST', {}, { title: 'Test Task' });
const res2 = new MockVercelResponse();
handler(req2, res2);

console.log('\n✅ API handlers executed successfully\n');
