import { Component } from "./Component";
import Arc, { IMemberState as MemberSchema } from "@daostack/client";

type GraphSchema = MemberSchema;
type ViewMethods = { };
type ActionMethods = { };

interface Props {
  address: string;
}

export default class Member extends Component<
  Props,
  GraphSchema,
  ViewMethods,
  ActionMethods
>
{
   createObservable(props: Props, arc: Arc): Observable<GraphSchema> {
     
   }
}

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
