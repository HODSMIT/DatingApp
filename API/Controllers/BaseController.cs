using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")] // localhost:5001/api/Members
    [ApiController]
    public class BaseController : ControllerBase
    {
    }
}
