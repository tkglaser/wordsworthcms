using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class UserViewModel
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public PermissionType Type { get; set; }
        public Guid? SiteId { get; set; }
        public string SiteName { get; set; }
    }
}