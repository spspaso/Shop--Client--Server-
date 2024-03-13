using ShopService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopService.Interfaces
{
    public interface ISellerRepository
    {
        IQueryable<Seller> GetAll();
        Seller GetById(int id);
        void Add(Seller seller);
        void Update(Seller seller);
        void Delete(Seller seller);
    }
}
