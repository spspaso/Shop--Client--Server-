using AutoMapper;
using ShopService.Models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopService.Models
{
    public class SellerProfile: Profile
    {
        public SellerProfile() { 
            CreateMap<Seller, SellerDTO>();
        }
    }
}
