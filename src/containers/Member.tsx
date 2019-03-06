/*import { Container } from "./Container";
import Arc, { IMemberState as MemberSchema } from "@daostack/client";

type GraphSchema = MemberSchema;
type ViewMethods = { };
type ActionMethods = { };

interface Props {
  address: string;
}

export default class Member extends Container<
  Props,
  GraphSchema,
  ViewMethods,
  ActionMethods
>
{
   createObservable(props: Props, arc: Arc): Observable<GraphSchema> {
     
   }
}
*/
// Ideal usage
/*
/// Member.Graph
<Member address="0x234234234">
  <Member.Graph>
    {member => (
      <div>{member.reputation}</div>
    )}
</Member>
*/
