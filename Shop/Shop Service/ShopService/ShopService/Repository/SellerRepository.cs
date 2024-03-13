﻿using Microsoft.EntityFrameworkCore;
using ShopService.Interfaces;
using ShopService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopService.Repository
{
    public class SellerRepository: ISellerRepository
    {
        private readonly AppDbContext _context;

        public SellerRepository(AppDbContext context)
        {
            this._context = context;
        }

        public IQueryable<Seller> GetAll()
        {
            return _context.Sellers;
        }

        public Seller GetById(int id)
        {
            return _context.Sellers.FirstOrDefault(p => p.Id == id);
        }

        public void Add(Seller book)
        {
            _context.Sellers.Add(book);
            _context.SaveChanges();
        }

        public void Update(Seller book)
        {
            _context.Entry(book).State = EntityState.Modified;

            try
            {
                _context.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
        }

        public void Delete(Seller book)
        {
            _context.Sellers.Remove(book);
            _context.SaveChanges();
        }
    }
}
