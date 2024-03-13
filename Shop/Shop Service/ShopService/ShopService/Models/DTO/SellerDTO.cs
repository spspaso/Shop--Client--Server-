﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ShopService.Models.DTO
{
    public class SellerDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public int Year { get; set; }
        public string ShopId { get; set; }
        public string ShopName { get; set; }
        public string ShopAddress { get; set; }
    }
}
