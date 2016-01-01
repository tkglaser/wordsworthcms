using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace com.vorwardit.jollyapp.cms.Modules
{
    public class ModuleParameterAttribute : Attribute
    {
        public string Friendlyname { get; }

        public ModuleParameterAttribute(string friendlyName)
        {
            this.Friendlyname = friendlyName;
        }
    }
}