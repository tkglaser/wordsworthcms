using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class SiteViewModel
    {
        public Guid SiteId { get; set; }

        public string Name { get; set; }

        public string[] Bindings { get; set; }
    }
}