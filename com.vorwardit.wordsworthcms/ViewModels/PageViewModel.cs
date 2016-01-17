using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class PageViewModel
    {
        public Guid PageId { get; set; }
        public Guid PageLayoutId { get; set; }
        public string PageLayoutName { get; set; }
        public string Name { get; set; }
        public UrlViewModel[] Urls { get; set; }
    }
}