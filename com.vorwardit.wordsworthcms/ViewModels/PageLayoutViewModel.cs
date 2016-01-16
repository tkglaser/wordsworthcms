using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class PageLayoutViewModel
    {
        public Guid PageLayoutId { get; set; }
        public Guid LayoutId { get; set; }
        public string Name { get; set; }
        public string Body { get; set; }
    }
}