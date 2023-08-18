const express = require('express');
const mysql = require('mysql2');
const db = require('../db/db');

const createcategory = (req, res) => {
    const { name } = req.body;
    const sql = 'INSERT INTO categories (name) VALUES (?)';
    db.query(sql, [name], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Category added successfully' });
    });
  }


  const createsubcategory = (req, res) => {
    const { name, category_id } = req.body;
    const sql = 'INSERT INTO subcategories (name, category_id) VALUES (?, ?)';
    db.query(sql, [name, category_id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Subcategory added successfully' });
    });
  }


  const createchildsubcategory = (req, res) => {
    const { name, subcategory_id } = req.body;
    const sql = 'INSERT INTO child_subcategories (name, subcategory_id) VALUES (?, ?)';
    db.query(sql, [name, subcategory_id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Child subcategory added successfully' });
    });
  }


  const getAll = (req, res) => {
    const sql = `
      SELECT 
        c.id AS category_id, c.name AS category_name,
        s.id AS subcategory_id, s.name AS subcategory_name,
        cs.id AS child_subcategory_id, cs.name AS child_subcategory_name
      FROM categories c
      LEFT JOIN subcategories s ON c.id = s.category_id
      LEFT JOIN child_subcategories cs ON s.id = cs.subcategory_id
    `;
    db.query(sql, (err, result) => {
      if (err) throw err;
      const categories = [];
      for (const row of result) {
        const existingCategory = categories.find(cat => cat.id === row.category_id);
        if (existingCategory) {
          const existingSubcategory = existingCategory.subcategories.find(sub => sub.id === row.subcategory_id);
          if (existingSubcategory) {
            existingSubcategory.child_subcategories.push({
              id: row.child_subcategory_id,
              name: row.child_subcategory_name
            });
          } else {
            existingCategory.subcategories.push({
              id: row.subcategory_id,
              name: row.subcategory_name,
              child_subcategories: row.child_subcategory_id ? [{
                id: row.child_subcategory_id,
                name: row.child_subcategory_name
              }] : []
            });
          }
        } else {
          categories.push({
            id: row.category_id,
            name: row.category_name,
            subcategories: row.subcategory_id ? [{
              id: row.subcategory_id,
              name: row.subcategory_name,
              child_subcategories: row.child_subcategory_id ? [{
                id: row.child_subcategory_id,
                name: row.child_subcategory_name
              }] : []
            }] : []
          });
        }
      }
      res.json(categories);
    });
  }

  module.exports = {getAll,createchildsubcategory,createsubcategory,createcategory}