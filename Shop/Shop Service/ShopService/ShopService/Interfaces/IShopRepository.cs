using ShopService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopService.Interfaces
{
    public interface IShopRepository
    {
        IQueryable<Shop> GetAll();
        Shop GetById(int id);
        void Add(Shop shop);
        void Update(Shop shop);
        void Delete(Shop shop);
    }
}
