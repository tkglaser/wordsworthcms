using com.vorwardit.wordsworthcms.Modules.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace com.vorwardit.wordsworthcms.ViewModels
{
    public class EditModuleModel
    {
		public string selectedModule { get; set; }
        public virtual ICollection<ModuleCacheEntry> Modules { get; set; }
    }
}