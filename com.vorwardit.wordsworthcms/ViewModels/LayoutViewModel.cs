using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class LayoutViewModel
    {
        public Guid LayoutId { get; set; }
        public Guid SiteId { get; set; }
        public string Name { get; set; }
        public string Body { get; set; }
    }
}