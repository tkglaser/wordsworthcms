using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.jollyapp.cms.Modules
{
    public class ModuleAttribute : Attribute
    {
        public string Friendlyname { get; }

        public ModuleAttribute(string friendlyName)
        {
            this.Friendlyname = friendlyName;
        }
    }
}